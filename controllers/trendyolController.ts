// trendyol-scraper.ts
import { Request, Response } from "express-serve-static-core";
import axios from "axios";
const path = require("path");
const fs = require("fs");
import slugify from "slugify";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import { Cluster } from "puppeteer-cluster";
const puppeteerCore = require("puppeteer-core");
const puppeteer = require("puppeteer");
const chromium = require("@sparticuz/chromium");
import type { ElementHandle } from "puppeteer";
import cron from "node-cron";
import Product from "../model/Product";
import ExcludedProduct from "../model/ExcludedProducts";
import ProcessingProgress from "../model/ProcessingProgress";

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

// ================== Credentials / Config ==================
const SELLER_ID = process.env.TRENDYOL_SELLER_ID || "";
const API_KEY = process.env.TRENDYOL_API_KEY || "";
const API_SECRET = process.env.TRENDYOL_API_SECRET || "";
const SELLER_NAME = process.env.TRENDYOL_SELLER_NAME || "";

const token = Buffer.from(`${API_KEY}:${API_SECRET}`).toString("base64");
const BASE_URL = "https://apigw.trendyol.com";

const trendyol = axios.create({
  baseURL: BASE_URL,
  headers: {
    "User-Agent": `${SELLER_ID} - Lady Globe FZC LLC`,
    "Content-Type": "application/json",
    Storefrontcode: "AE",
    Authorization: `Basic ${token}`,
  },
});

// Local files
const cookiesPath = path.join(process.cwd(), "trendyol_cookies.json");
const userDataDir = path.join(process.cwd(), "puppeteer_profile");

// Runtime config (env overrides)
const CLUSTER_CONCURRENCY = Number(process.env.CLUSTER_CONCURRENCY || 3); // pages in parallel
const BATCH_SIZE = Number(process.env.BATCH_SIZE || 5); // how many products per scheduled run
const HEADLESS = (process.env.HEADLESS ?? "true") === "true";
const CRON_SCHEDULE = process.env.CRON_SCHEDULE || "*/5 * * * *"; // every 5 minutes
const NAV_TIMEOUT = Number(process.env.NAV_TIMEOUT || 60000); // navigation timeout

// Helper utilities
function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

let clusterInstance: any = null;
let clusterInitInProgress = false;

function normalizeCookieForCDP(cookie: any) {
  // cookie is likely from puppeteer/normal page.cookies() format or from another browser
  // return an object suitable for Network.setCookie
  const domain = (cookie.domain || cookie.origin || "").replace(/^\./, "");
  const path = cookie.path || "/";
  const expires = cookie.expires
    ? // puppeteer page.cookies() returns expiry in seconds already sometimes
      Math.floor(Number(cookie.expires))
    : undefined;

  // map sameSite -> "None" | "Lax" | "Strict"
  let sameSite = undefined;
  if (cookie.sameSite) {
    const s = String(cookie.sameSite).toLowerCase();
    if (s.includes("none")) sameSite = "None";
    else if (s.includes("lax")) sameSite = "Lax";
    else if (s.includes("strict")) sameSite = "Strict";
  }

  return {
    name: cookie.name,
    value: cookie.value,
    domain: domain || undefined,
    path,
    secure: !!cookie.secure,
    httpOnly: !!cookie.httpOnly,
    sameSite,
    expires,
  };
}

async function setCookiesOnPageWithCDP(page: any, cookies: any[]) {
  // create CDP session on page
  const client = await page.createCDPSession();
  for (const raw of cookies) {
    const c = normalizeCookieForCDP(raw);
    // Network.setCookie requires domain (or url) — prefer domain if present
    try {
      const params: any = {
        name: c.name,
        value: c.value,
        domain: c.domain,
        path: c.path,
        secure: c.secure,
        httpOnly: c.httpOnly,
      };
      if (c.sameSite) params.sameSite = c.sameSite;
      if (typeof c.expires !== "undefined" && !Number.isNaN(c.expires)) {
        // CDP expects number (Unix time in seconds)
        params.expires = Math.floor(Number(c.expires));
      }
      // If domain is not present, you can set a url instead (use target page origin)
      if (!params.domain) {
        const urlOrigin = new URL(page.url() || "https://www.trendyol.com")
          .origin;
        params.url = urlOrigin;
      }
      await client.send("Network.setCookie", params);
    } catch (err: any) {
      // don't fail everything if a single cookie is malformed
      console.warn(
        "[setCookiesOnPageWithCDP] cookie set failed:",
        raw.name,
        err?.message || err
      );
    }
  }
}

function buildProductUrl(p: any) {
  const slug = slugify(p.title || p.name || "", { lower: true, strict: true });
  const brandSlug = slugify(p.brand, { lower: true, strict: true });
  return `https://www.trendyol.com/en/${brandSlug}/${slug}-p-${p.productContentId}`;
}

async function saveProductData(productData) {
  const { productCode, ...updateFields } = productData;
  await Product.findOneAndUpdate(
    { productCode },
    { $set: { ...updateFields, lastScrapedAt: new Date() } },
    { upsert: true, new: true }
  );
}

/**
 * Initialize Puppeteer Cluster using puppeteer-core + @sparticuz/chromium-min
 * Compatible with Render, Railway, Vercel, etc.
 */

async function initCluster() {
  if (clusterInstance) return clusterInstance;

  let executablePath: string;
  // let chromiumArgs = ["--no-sandbox", "--disable-setuid-sandbox"];
  let chromiumArgs = [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--disable-background-timer-throttling",
    "--disable-renderer-backgrounding",
    "--disable-backgrounding-occluded-windows",
    "--disable-extensions",
    "--single-process",
  ];

  if (process.env.NODE_ENV === "production") {
    executablePath = await chromium.executablePath();
    chromiumArgs = chromium.args;
  } else {
    executablePath = puppeteer.executablePath();
  }

  if (clusterInitInProgress) {
    while (clusterInitInProgress && !clusterInstance) await sleep(200);
    return clusterInstance!;
  }

  clusterInitInProgress = true;
  console.log("[scraper] Initializing Puppeteer Cluster...");

  try {
    const defaultViewport = { width: 1280, height: 900 };

    // clusterInstance = await Cluster.launch({
    //   concurrency: Cluster.CONCURRENCY_PAGE,
    //   maxConcurrency: CLUSTER_CONCURRENCY,
    //   puppeteer: puppeteerCore,
    //   puppeteerOptions: {
    //     headless: HEADLESS,
    //     executablePath,
    //     args: chromiumArgs,
    //     userDataDir,
    //   },
    //   timeout: NAV_TIMEOUT * 2,
    //   monitor: false,
    // });
    const isProd = process.env.NODE_ENV === "production";

    clusterInstance = await Cluster.launch({
      concurrency: isProd ? Cluster.CONCURRENCY_PAGE : Cluster.CONCURRENCY_PAGE, // use PAGE even on Render
      maxConcurrency: isProd ? 1 : CLUSTER_CONCURRENCY,
      puppeteer: puppeteerCore,
      puppeteerOptions: {
        headless: true,
        executablePath,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--disable-software-rasterizer",
          "--no-zygote",
          "--no-first-run",
          "--no-default-browser-check",
        ],
        dumpio: false,
      },
      timeout: NAV_TIMEOUT * 2,
      monitor: false,
    });

    // ------------------ Cluster Task ------------------
    await clusterInstance.task(async ({ page, data: { url } }) => {
      page.setDefaultNavigationTimeout(NAV_TIMEOUT);

      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
      );
      await page.setExtraHTTPHeaders({ "Accept-Language": "en-US,en;q=0.9" });
      await page.setViewport(defaultViewport);

      try {
        if (fs.existsSync(cookiesPath)) {
          const cookies = JSON.parse(fs.readFileSync(cookiesPath, "utf8"));
          if (Array.isArray(cookies) && cookies.length) {
            await page.setCookie(...cookies);
          }
        }
      } catch (e) {
        console.warn("[task] failed to set cookies:", (e as any).message);
      }

      try {
        await page.goto(url, {
          waitUntil: "networkidle2",
          timeout: NAV_TIMEOUT,
        });
      } catch (e: any) {
        console.warn("[task] goto failed, retrying:", e.message);
        await page.goto(url, {
          waitUntil: "domcontentloaded",
          timeout: NAV_TIMEOUT,
        });
      }

      if (page.url().includes("/select-country")) {
        console.log(
          "[task] Detected /select-country page — auto-selecting UAE..."
        );

        try {
          await page.waitForSelector('[data-testid="country-select"]', {
            timeout: 10000,
          });
          await page.waitForSelector('[data-testid="country-select-btn"]', {
            timeout: 10000,
          });

          await page.select(
            '[data-testid="country-select"]',
            "United Arab Emirates"
          );
          console.log("[task] Selected United Arab Emirates");

          await page.click('[data-testid="country-select-btn"]');
          console.log("[task] Clicked Select button...");

          // Wait for redirect after selection
          await page.waitForNavigation({
            waitUntil: "networkidle2",
            timeout: 30000,
          });

          // Save cookies for future sessions
          const cookies = await page.cookies();
          fs.writeFileSync(
            cookiesPath,
            JSON.stringify(cookies, null, 2),
            "utf8"
          );
          console.log("[task] UAE selected & cookies saved.");

          // Reload original product page
          await page.goto(url, { waitUntil: "networkidle2" });
        } catch (err: any) {
          console.error("[task] Auto-select UAE failed:", err.message || err);
          return false;
        }
      }

      // Handle unexpected redirects
      page.on("framenavigated", async (frame) => {
        const u = frame.url();
        if (u.includes("partner.trendyol.com")) {
          console.warn("[task] Redirect detected; navigating back.");
          await page.goto(url, { waitUntil: "networkidle2" });
        }
      });

      // ----------- Extract product data -----------
      const result = await page.evaluate(() => {
        const getText = (sel: string) => {
          const el = document.querySelector(sel);
          return el ? el.textContent.trim() : null;
        };

        const title = getText("h1.pr-new-br, h1.product-title, h1");
        const salePrice = getText(
          "div.pr-bx-nm span.prc-slg, div.p-strikethrough-price"
        );
        const seller =
          getText(
            "div.store-link-header, div.merchant-name, .merchant, a[href*='/sellers/']"
          ) || getText("a.store-link");

        return { title, salePrice, seller, url: window.location.href };
      });

      return result;
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      console.log("[scraper] SIGINT — closing cluster...");
      if (clusterInstance) await clusterInstance.close();
      process.exit(0);
    });

    console.log("[scraper] Puppeteer Cluster initialized.");
    return clusterInstance;
  } catch (err) {
    clusterInitInProgress = false;
    console.error("[initCluster] Failed to launch cluster:", err);
    throw err;
  } finally {
    clusterInitInProgress = false;
  }
}

/*
// async function initCluster() {
//   if (clusterInstance) return clusterInstance;

//   if (clusterInitInProgress) {
//     while (clusterInitInProgress && !clusterInstance) await sleep(200);
//     return clusterInstance!;
//   }

//   clusterInitInProgress = true;
//   console.log("[scraper] Initializing Puppeteer Cluster...");

//   try {
//     const defaultViewport = { width: 1280, height: 900 };

//     // ----- 1️⃣ Configure environment-specific Chrome setup -----
//     const isProd = process.env.NODE_ENV === "production";

//     const chromiumArgs = [
//       "--no-sandbox",
//       "--disable-setuid-sandbox",
//       "--disable-dev-shm-usage", // avoids /dev/shm crashes
//       "--disable-gpu",
//       "--disable-background-timer-throttling",
//       "--disable-renderer-backgrounding",
//       "--disable-backgrounding-occluded-windows",
//       "--disable-extensions",
//       "--single-process",
//     ];

//     let executablePath: string;
//     if (isProd) {
//       // Render / Server
//       executablePath =
//         process.env.PUPPETEER_EXECUTABLE_PATH ||
//         process.env.CHROME_BIN ||
//         (await chromium.executablePath());
//     } else {
//       // Local dev uses full Puppeteer
//       executablePath = puppeteer.executablePath();
//     }

//     // ----- 2️⃣ Launch Puppeteer Cluster -----
//     clusterInstance = await Cluster.launch({
//       concurrency: isProd
//         ? Cluster.CONCURRENCY_CONTEXT // safer in container
//         : Cluster.CONCURRENCY_PAGE,   // faster in dev
//       maxConcurrency: isProd ? 2 : CLUSTER_CONCURRENCY,
//       puppeteer: puppeteerCore,
//       puppeteerOptions: {
//         headless: isProd ? true : HEADLESS,
//         executablePath,
//         args: chromiumArgs,
//         userDataDir,
//         dumpio: false,
//       },
//       timeout: NAV_TIMEOUT * 2,
//       monitor: false,
//       retryLimit: 2,
//       retryDelay: 5000,
//     });

//     // ----- 3️⃣ Define cluster task -----
//     await clusterInstance.task(async ({ page, data: { url } }) => {
//       page.setDefaultNavigationTimeout(NAV_TIMEOUT);

//       await page.setUserAgent(
//         "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
//       );
//       await page.setExtraHTTPHeaders({ "Accept-Language": "en-US,en;q=0.9" });
//       await page.setViewport(defaultViewport);

//       // --- Load cookies ---
//       try {
//         if (fs.existsSync(cookiesPath)) {
//           const cookies = JSON.parse(fs.readFileSync(cookiesPath, "utf8"));
//           if (Array.isArray(cookies) && cookies.length) {
//             await page.setCookie(...cookies);
//           }
//         }
//       } catch (e) {
//         console.warn("[task] failed to set cookies:", (e as any).message);
//       }

//       // --- Safe navigation ---
//       const tryGoto = async () => {
//         try {
//           await page.goto(url, { waitUntil: "networkidle2", timeout: NAV_TIMEOUT });
//         } catch (e) {
//           console.warn("[task] goto failed, retrying with domcontentloaded:", e.message);
//           await page.goto(url, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT * 2 });
//         }
//       };
//       await tryGoto();

//       // --- Auto-select UAE if needed ---
//       if (page.url().includes("/select-country")) {
//         console.log("[task] Detected /select-country page — auto-selecting UAE...");
//         try {
//           await page.waitForSelector('[data-testid="country-select"]', { timeout: 10000 });
//           await page.waitForSelector('[data-testid="country-select-btn"]', { timeout: 10000 });

//           await page.select('[data-testid="country-select"]', "United Arab Emirates");
//           await page.click('[data-testid="country-select-btn"]');
//           await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 30000 });

//           const cookies = await page.cookies();
//           fs.writeFileSync(cookiesPath, JSON.stringify(cookies, null, 2), "utf8");
//           console.log("[task] UAE selected & cookies saved.");

//           await tryGoto();
//         } catch (err: any) {
//           console.error("[task] Auto-select UAE failed:", err.message);
//           return false;
//         }
//       }

//       // --- Handle redirects ---
//       page.on("framenavigated", async (frame) => {
//         const u = frame.url();
//         if (u.includes("partner.trendyol.com")) {
//           console.warn("[task] Redirect detected; navigating back.");
//           await tryGoto();
//         }
//       });

//       // --- Extract product data ---
//       const result = await page.evaluate(() => {
//         const getText = (sel) => {
//           const el = document.querySelector(sel);
//           return el ? el.textContent.trim() : null;
//         };
//         const title = getText("h1.pr-new-br, h1.product-title, h1");
//         const salePrice = getText("div.pr-bx-nm span.prc-slg, div.p-strikethrough-price");
//         const seller =
//           getText("div.store-link-header, div.merchant-name, .merchant, a[href*='/sellers/']") ||
//           getText("a.store-link");
//         return { title, salePrice, seller, url: window.location.href };
//       });

//       return result;
//     });

//     // ----- Graceful shutdown -----
//     process.on("SIGINT", async () => {
//       console.log("[scraper] SIGINT — closing cluster...");
//       if (clusterInstance) await clusterInstance.close();
//       process.exit(0);
//     });

//     console.log("[scraper] Puppeteer Cluster initialized.");
//     return clusterInstance;
//   } catch (err) {
//     clusterInitInProgress = false;
//     console.error("[initCluster] Failed to launch cluster:", err);
//     throw err;
//   } finally {
//     clusterInitInProgress = false;
//   }
// }
*/

async function scrapeProductWithCluster(url: string) {
  const cluster = await initCluster();
  // console.log("[scrapeProductWithCluster] scraping", url, "...", "CLUSTER", cluster);
  try {
    const result = await cluster.execute({ url });
    // console.log("[scrapeProductWithCluster] scrape result:", result);
    return result;
  } catch (err: any) {
    console.warn(
      "[scrapeProductWithCluster] scrape failed for",
      url,
      err.message || err
    );
    throw err;
  }
}

// Process products array - either batch (BATCH_SIZE) or all if requested
async function processProducts(
  products: any[],
  opts?: { maxToProcess?: number }
) {
  const maxToProcess = opts?.maxToProcess ?? products.length;
  const results: any[] = [];

  const excludedProducts = await ExcludedProduct.find({}, "productCode").lean();
  const excludedCodes = new Set(excludedProducts.map((p) => p.productCode));

  const filteredProducts = products.filter(
    (p) => !excludedCodes.has(p.productCode)
  );

  if (filteredProducts.length === 0) {
    console.log(
      "[processProducts] No products left after exclusion — exiting early."
    );
    return [];
  }

  const progressDoc = await ProcessingProgress.findOneAndUpdate(
    { key: "trendyol_progress" },
    { $setOnInsert: { pointer: 0 } },
    { upsert: true, new: true }
  );

  let pointer = progressDoc.pointer || 0;

  const toProcess: any[] = [];
  for (let i = 0; i < Math.min(maxToProcess, filteredProducts.length); i++) {
    const idx = (pointer + i) % filteredProducts.length;
    toProcess.push({ product: filteredProducts[idx], idx });
  }

  let newPointer = pointer + toProcess.length;
  if (newPointer >= filteredProducts.length) {
    newPointer = 0;
  } else {
    newPointer = newPointer % filteredProducts.length;
  }
  await ProcessingProgress.updateOne(
    { key: "trendyol_progress" },
    { $set: { pointer: newPointer } }
  );

  console.log(
    `[processProducts] Batch start=${pointer}, next=${newPointer}, size=${toProcess.length}/${filteredProducts.length}`
  );

  const executePromises = toProcess.map(async ({ product }) => {
    const productUrl = buildProductUrl(product);
    const sku = product.barcode || null;

    try {
      const scraped = await scrapeProductWithCluster(productUrl);
      const isBuyBox =
        scraped &&
        scraped.seller &&
        SELLER_NAME &&
        scraped.seller.toLowerCase().includes(SELLER_NAME.toLowerCase());

      return {
        productContentId: product.productContentId,
        productCode: product.productCode,
        barcode: product.barcode,
        sku,
        title: scraped?.title || product.title,
        brand: product.brand,
        categoryName: product.categoryName,
        quantity: product.quantity || 0,
        salePrice: scraped?.salePrice || product.listPrice,
        buyBox: isBuyBox ? "Yes" : "No",
        merchant: scraped?.seller || "Unknown",
        url: scraped?.url || productUrl,
        error: null,
      };
    } catch (err: any) {
      return {
        productContentId: product.productContentId,
        productCode: product.productCode,
        barcode: product.barcode,
        sku,
        title: product.title,
        brand: product.brand,
        categoryName: product.categoryName,
        quantity: product.quantity || 0,
        salePrice: product.listPrice,
        buyBox: "Unknown",
        merchant: "Unknown",
        url: productUrl,
        error: err?.message || "Scrape failed",
      };
    }
  });

  const settled = await Promise.all(executePromises);
  results.push(...settled);
  return results;
}

// ---------- Public HTTP handler (on-demand) ----------
const getInventory = async (req: Request, res: Response) => {
  try {
    // const products = await Product.find({});
    const products = await Product.aggregate([
      {
        $addFields: {
          buyboxPriority: {
            $cond: [{ $eq: ["$isBuyBox", "true"] }, 1, 0], // "yes" → 1, "no"/others → 0
          },
        },
      },
      {
        $sort: { buyboxPriority: -1, lastScrapedAt: -1 }, // prioritize buybox=yes, then latest scraped
      },
    ]);

    res.json({ items: products.length, products });
  } catch (err: any) {
    console.error(
      "[getInventory] error:",
      err.response?.data || err.message || err
    );
    res
      .status(500)
      .json({ error: "Failed get products inventory", details: err.message });
  }
};

// ---------- Price update (kept from original) ----------
async function handleUpdatePrice(
  barcode: string,
  newPrice: number,
  quantity?: number,
  product_id?: String,
  productCode?: string
) {
  try {
    const { data } = await trendyol.post(
      `/integration/inventory/sellers/${SELLER_ID}/products/price-and-inventory`,
      {
        items: [
          {
            barcode: barcode,
            quantity: typeof quantity === "number" ? quantity : "",
            listPrice: newPrice,
            salePrice: newPrice,
          },
        ],
      }
    );

    console.log("[parameters to update product", {
      product_id,
      productCode,
      newPrice,
    });

    const product = await Product.findOneAndUpdate(
      { productCode },
      {
        $set: {
          listPrice: newPrice,
          salePrice: newPrice,
          lastUpdatedAt: new Date(),
        },
      },
      { new: true }
    );

    return data;
  } catch (err: any) {
    console.error(
      "[updatePrice] Price update failed:",
      err.response?.data || err.message
    );
    return { error: "Failed to update price" };
  }
}

const updatePrice = async (req: Request, res: Response) => {
  try {
    const { barcode, newPrice, quantity, product_id, productCode } = req.body;

    if (!barcode || typeof newPrice !== "number") {
      return res
        .status(400)
        .json({ error: "Missing required fields: barcode, newPrice (number)" });
    }

    const result = await handleUpdatePrice(
      barcode,
      newPrice,
      quantity,
      product_id,
      productCode
    );

    if (result?.error) {
      return res.status(500).json({
        error: "Failed to update price on Trendyol",
        details: result.error,
      });
    }

    res.json({ message: "Price updated successfully", result });
  } catch (err: any) {
    console.error("[updatePriceController] error:", err.message || err);
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
};

const addExcludedProduct = async (req: Request, res: Response) => {
  try {
    const { productCode, reason, addedBy } = req.body;

    if (!productCode)
      return res.status(400).json({ error: "productCode is required" });

    const product = await ExcludedProduct.findOneAndUpdate(
      { productCode },
      { $set: { reason, addedBy } },
      { upsert: true, new: true }
    );

    res.json({ message: "Product excluded successfully", product });
  } catch (err) {
    res.status(500).json({
      error: "Failed to exclude product",
      details: err.message,
    });
  }
};

const removeExcludedProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const productCode = id;

    console.log("[removeExcludedProduct] productCode:", productCode);

    const deleted = await ExcludedProduct.findOneAndDelete({ productCode });

    if (!deleted)
      return res
        .status(404)
        .json({ error: "Product not found in exclusion list" });

    res.json({ message: "Product removed from exclusion list", deleted });
  } catch (err) {
    res.status(500).json({
      error: "Failed to remove product from exclusion list",
      details: err.message,
    });
  }
};

const getExcludedProducts = async (req: Request, res: Response) => {
  try {
    const products = await ExcludedProduct.find({});
    res.json({ items: products.length, products });
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch excluded products",
      details: err.message,
    });
  }
};

/**
 * Fetch and store all Trendyol products for this seller.
 * Can be reused manually or by cron.
 */
async function fetchAndStoreTrendyolProducts() {
  console.log("[trendyol] Fetch job started");

  try {
    // Fetch all products
    const { data } = await trendyol.get(
      `/integration/product/sellers/${SELLER_ID}/products`,
      { params: { page: 0, size: 5000, onSale: true } }
    );

    const products = data?.content || [];
    console.log(`[trendyol] fetched ${products.length} products`);

    for (const p of products) {
      try {
        await saveProductData({ productCode: p.productCode, ...p });
        // console.log(`[trendyol] updated productCode=${p.productCode}`);
      } catch (e) {
        console.error(
          `[trendyol] failed productCode=${p.productCode}:`,
          e.message
        );
      }
    }

    console.log(`[trendyol] processed ${products.length} products`);
  } catch (err) {
    console.error("[trendyol] fetch job failed:", err.message);
  }
}

// ---------- Scheduler ----------
// Cron job: runs every CRON_SCHEDULE (default every 5 minutes).
async function scheduledJob() {
  try {
    console.log(
      "[scheduler] scheduled job started at",
      new Date().toISOString()
    );

    // Fetch products
    const { data } = await trendyol.get(
      `/integration/product/sellers/${SELLER_ID}/products`,
      { params: { page: 0, size: 5000, onSale: true } }
    );
    const products = data?.content || [];
    if (!products.length) {
      console.warn("[scheduler] no products returned from API");
      return;
    }

    // Only process BATCH_SIZE items per scheduled run to spread load across intervals
    const results = await processProducts(products, {
      maxToProcess: BATCH_SIZE,
    });
    console.log(`[scheduler] processed ${results.length} items:`, results);

    // --- Update MongoDB with scraped results ---
    for (const r of results) {
      try {
        if (!r || !r.productCode) continue; // skip invalid results

        await Product.findOneAndUpdate(
          { productCode: r.productCode }, // or productCode, depending on your ID mapping
          {
            $set: {
              title: r.title,
              price: r.salePrice ?? r.price,
              buyboxOwner: r.merchant ?? r.buyboxOwner,
              seller: r.seller ?? r.merchant,
              quantity: r.stock ?? r.quantity,
              isBuyBox: r.buyBox === "Yes",
              lastScrapedAt: new Date(),
              productUrl: r.url,
            },
          },
          { new: true }
        );

        // update price for products where the buybox owner is not us
        if (
          r.buyBox !== "Yes" &&
          r.barcode &&
          r.salePrice &&
          r.error === null
        ) {
          const competitivePrice = Number((r.salePrice - 0.1).toFixed(2)); // undercut by $0.10
          console.log(
            `[scheduler] updating price for productCode=${r.productCode}, sku=${r.sku} to ${competitivePrice}`
          );
          // barcode,
          // newPrice,
          // quantity,
          // product_id,
          // productCode
          await handleUpdatePrice(
            r.barcode,
            competitivePrice,
            r.quantity,
            r._id,
            r.productCode
          );
        }
      } catch (err) {
        console.error(
          `[scraper] failed to update product ${r.productId}:`,
          err.message
        );
      }
    }

    console.log(
      `[scraper] updated ${results.length} scraped products in MongoDB.`
    );

    // Optionally: push results to a DB / queue or file (not implemented here)
  } catch (e: any) {
    console.error("[scheduler] failed:", e.message || e);
  }
}

function startScheduler() {
  console.log(`[scheduler] starting cron schedule: ${CRON_SCHEDULE}`);
  cron.schedule(CRON_SCHEDULE, () => {
    scheduledJob().catch((e) => console.error("[scheduler] job error:", e));
  });
}

// ---------- Initialization ----------
(async () => {
  try {
    // initialize cluster (but don't force heavy tasks yet)
    await initCluster();

    // Start the scheduler for background processing
    startScheduler();

    console.log(
      "[scraper] module ready. getInventory exported for on-demand runs."
    );
  } catch (e) {
    console.error("[scraper] initialization failed:", e);
  }
})();

/**
 * Schedule to run every 60 minutes
 */
cron.schedule("*/60 * * * *", async () => {
  await fetchAndStoreTrendyolProducts();
});

// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false, // Keep it visible for manual actions
//     defaultViewport: null,
//   });

//   const page = await browser.newPage();

//   const targetUrl =
//     "https://www.trendyol.com/en/lattafa/eclaire-eau-de-parfum-100-ml-p-922771802";

//   console.log("\n🌍 Navigating to Trendyol...");
//   await page.goto(targetUrl, { waitUntil: "domcontentloaded" });

//   console.log(`
// ✅ Browser opened and page loaded.

// 👉 Please:
//   1️⃣ Select your country (United Arab Emirates)
//   2️⃣ Accept cookies or login if required
//   3️⃣ Wait for the product page to fully load
//   4️⃣ Then press ENTER in this terminal to save cookies
// `);

//   // ⏸️ Wait for user to press ENTER before continuing
//   await new Promise<void>((resolve) => {
//     process.stdin.resume();
//     process.stdin.on("data", () => resolve());
//   });

//   console.log("💾 Collecting cookies...");

//   // ✅ Get cookies *after* user has manually selected country
//   const cookies = await page.cookies();

//   // ✅ Define where to save them
//   const cookiesPath =
//     process.env.NODE_ENV === "production"
//       ? "/tmp/trendyol_cookies.json"
//       : path.join(process.cwd(), "trendyol_cookies.json");

//   // ✅ Save to file
//   fs.writeFileSync(cookiesPath, JSON.stringify(cookies, null, 2));

//   console.log(`\n🍪 Saved ${cookies.length} cookies → ${cookiesPath}\n`);

//   console.log("✅ You can now close the browser manually (or press ENTER again).");

//   await browser.close();
//   // process.exit(0);
// })();

// Export module API
module.exports = {
  getInventory,
  updatePrice,
  addExcludedProduct,
  getExcludedProducts,
  removeExcludedProduct,
  // Also export helpers in case you want to call them externally:
  _internal: {
    initCluster,
    scrapeProductWithCluster,
    processProducts,
  },
};

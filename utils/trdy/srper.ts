// trendyol-scraper.ts
import { Request, Response } from "express-serve-static-core";
import axios from "axios";
const path = require("path");
const fs = require("fs");
import slugify from "slugify";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import { Cluster } from "puppeteer-cluster";
import puppeteer from "puppeteer";
import type { ElementHandle } from "puppeteer";
import cron from "node-cron";
import Product from "../model/Product";

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
    Authorization: `Bearer ${token}`,
  },
});

// Local files
const cookiesPath = path.join(process.cwd(), "trendyol_cookies.json");
const userDataDir = path.join(process.cwd(), "puppeteer_profile");
const progressPath = path.join(process.cwd(), "progress.json");

// Runtime config (env overrides)
const CLUSTER_CONCURRENCY = Number(process.env.CLUSTER_CONCURRENCY || 3); // pages in parallel
const BATCH_SIZE = Number(process.env.BATCH_SIZE || 5); // how many products per scheduled run
const HEADLESS = (process.env.HEADLESS ?? "true") === "true";
const CRON_SCHEDULE = process.env.CRON_SCHEDULE || "*/2 * * * *"; // every 5 minutes
const NAV_TIMEOUT = Number(process.env.NAV_TIMEOUT || 60000); // navigation timeout

// Helper utilities
function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

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

function readJSONSafe<T = any>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const txt = fs.readFileSync(filePath, "utf8");
      return JSON.parse(txt) as T;
    }
  } catch (e) {
    console.warn("[readJSONSafe] failed to read JSON:", filePath, e.message);
  }
  return fallback;
}

function writeJSONSafe(filePath: string, data: any) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (e) {
    console.warn("[writeJSONSafe] failed to write JSON:", filePath, e.message);
  }
}

function buildProductUrl(p: any) {
  const slug = slugify(p.title || p.name || "", { lower: true, strict: true });
  const brandSlug = slugify(p.brand, { lower: true, strict: true });
  return `https://www.trendyol.com/en/${brandSlug}/${slug}-p-${p.productContentId}`;
}

async function saveProductData(productData) {
  const { productId, ...updateFields } = productData;
  await Product.findOneAndUpdate(
    { productId },
    { $set: { ...updateFields, lastScrapedAt: new Date() } },
    { upsert: true, new: true }
  );
}

// ---------- Cluster / Scraper lifecycle ----------
let clusterInstance: Cluster | null = null;
let clusterInitInProgress = false;

async function initCluster() {
  if (clusterInstance) return clusterInstance;
  if (clusterInitInProgress) {
    // wait for it to be created by another caller
    while (clusterInitInProgress && !clusterInstance) {
      await sleep(200);
    }
    return clusterInstance!;
  }
  clusterInitInProgress = true;

  console.log("[scraper] Initializing Puppeteer Cluster...");
  clusterInstance = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_PAGE,
    maxConcurrency: CLUSTER_CONCURRENCY,
    puppeteer,
    puppeteerOptions: {
      headless: HEADLESS,
      userDataDir,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--lang=en-US,en"],
    },
    timeout: NAV_TIMEOUT * 2, // cluster-level timeout for tasks
    monitor: false,
  });

  // Set default task
  await clusterInstance.task(async ({ page, data: { url } }) => {
    // Each task must perform: ensure locale (if needed), navigate, extract
    page.setDefaultNavigationTimeout(NAV_TIMEOUT);
    page.setExtraHTTPHeaders({ "Accept-Language": "en-US,en;q=0.9" });
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
    );
    await page.setViewport({ width: 1280, height: 900 });

    // If cookies file exists, set cookies for page (best-effort)
    try {
      if (fs.existsSync(cookiesPath)) {
        const cookies = JSON.parse(fs.readFileSync(cookiesPath, "utf8"));
        if (Array.isArray(cookies) && cookies.length) {
          // ensure domain compatibility
          await page.setCookie(...cookies);
        }
      }
    } catch (e) {
      console.warn("[task] failed to set cookies:", e.message);
    }

    // Navigate to product
    try {
      await page.goto(url, { waitUntil: "networkidle2", timeout: NAV_TIMEOUT });
    } catch (e) {
      console.warn("[task] goto failed, retrying once:", e.message);
      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: NAV_TIMEOUT,
      });
    }

    // If we get redirected to select-country, handle setup once manually
    let currentUrl = page.url();
    let manualBrowserInstance: any = null;

    if (currentUrl.includes("/select-country")) {
      console.log("[task] select-country detected...");

      if (!fs.existsSync(cookiesPath)) {
        console.log(
          "[task] No cookies found — performing manual setup (one worker will do this)..."
        );

        const setupLockPath = path.join(process.cwd(), "cookie_setup.lock");

        // Try to claim the lock (atomic)
        let iAmTheSetupOwner = false;
        try {
          const fd = fs.openSync(setupLockPath, "wx");
          fs.writeSync(fd, Date.now().toString());
          fs.closeSync(fd);
          iAmTheSetupOwner = true;
        } catch {
          console.log(
            "[task] Another worker is performing cookie setup; waiting for cookies..."
          );
        }

        if (iAmTheSetupOwner) {
          // Launch a headful browser for manual selection
          const manualBrowser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
          });

          try {
            const manualPage = await manualBrowser.newPage();
            await manualPage.goto(currentUrl, {
              waitUntil: "domcontentloaded",
            });

            // Poll until the user finishes (URL no longer contains /select-country)
            const start = Date.now();
            const maxWait = 1000 * 60 * 5; // allow up to 5 minutes for manual setup
            let finished = false;

            while (Date.now() - start < maxWait && !finished) {
              try {
                const u = manualPage.url();
                if (!u.includes("/select-country")) {
                  finished = true;
                  break;
                }
              } catch (err) {
                // page might be navigated/temporarily unavailable; continue polling
              }
              await sleep(2000);
            }

            if (!finished) {
              console.warn(
                "[task] Manual cookie setup timed out after waiting."
              );
            } else {
              // Read cookies while page is still alive
              const cookies = await manualPage.cookies();
              fs.writeFileSync(
                cookiesPath,
                JSON.stringify(cookies, null, 2),
                "utf8"
              );
              console.log("[task] ✅ Cookies saved to trendyol_cookies.json");
            }
          } catch (err: any) {
            console.error("[task] Manual setup failed:", err.message || err);
          } finally {
            try {
              await manualBrowser.close();
            } catch {}
            if (fs.existsSync(setupLockPath)) fs.unlinkSync(setupLockPath);
          }
        } else {
          // Not owner -> wait for cookie file to appear (up to a timeout)
          let waited = 0;
          const maxWait = 180000; // 3 minutes
          while (!fs.existsSync(cookiesPath) && waited < maxWait) {
            await sleep(2000);
            waited += 2000;
          }
        }

        // After the above, try to load cookies and set them for this page
        if (fs.existsSync(cookiesPath)) {
          try {
            const cookies = JSON.parse(fs.readFileSync(cookiesPath, "utf8"));
            await setCookiesOnPageWithCDP(page, cookies);
            // reload
            await page.goto(url, { waitUntil: "networkidle2" });
          } catch (err: any) {
            console.warn(
              "[task] failed to apply cookies after setup:",
              err.message || err
            );
            return false;
          }
        } else {
          console.warn("[task] Timeout waiting for cookies — skipping URL.");
          return false;
        }
      } else {
        // Cookies already exist -> apply them via CDP and continue
        console.log("[task] Cookies already exist — applying them.");
        try {
          const cookies = JSON.parse(fs.readFileSync(cookiesPath, "utf8"));
          await setCookiesOnPageWithCDP(page, cookies);
          await page.goto(url, { waitUntil: "networkidle2" });
        } catch (err: any) {
          console.warn("[task] failed to apply cookies:", err.message || err);
          // fallthrough, maybe the page already has the right content after previous goto
        }
      }
    }

    page.on("framenavigated", async (frame) => {
      try {
        const u = frame.url();
        if (u.includes("partner.trendyol.com")) {
          console.warn(
            "[task] partner redirect detected; navigating back to product."
          );
          await page.goto(url, { waitUntil: "networkidle2" });
        }
      } catch (e) {
        // ignore frame handler errors
      }
    });

    // Extract product data (selectors kept similar to your original)
    const result = await page.evaluate(() => {
      const getText = (sel: string) => {
        const el = document.querySelector(sel);
        return el ? el.textContent.trim() : null;
      };

      const title = getText("h1.pr-new-br, h1.product-title, h1");
      const salePrice = getText("div.pr-bx-nm span.prc-slg, div.p-sale-price");
      const seller =
        getText(
          "div.store-link-header, div.merchant-name, .merchant, a[href*='/sellers/']"
        ) || getText("a.store-link");

      console.log("RESULT 1:", {
        title,
        salePrice,
        seller,
        url: window.location.href,
      });

      return { title, salePrice, seller, url: window.location.href };
    });

    console.log("RESULT", result);

    return result;
  });

  // Graceful shutdown on process exit
  process.on("SIGINT", async () => {
    console.log("[scraper] SIGINT received — shutting cluster down...");
    if (clusterInstance) await clusterInstance.close();
    process.exit(0);
  });

  clusterInitInProgress = false;
  console.log("[scraper] Puppeteer Cluster initialized.");
  return clusterInstance;
}

// ---------- Scraper orchestration ----------
async function scrapeProductWithCluster(url: string) {
  const cluster = await initCluster();
  // console.log("[scrapeProductWithCluster] scraping", url, "...", "CLUSTER", cluster);
  try {
    const result = await cluster.execute({ url });
    console.log("[scrapeProductWithCluster] scrape result:", result);
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

  // Pointer logic for rotating batches across scheduled runs
  const progress = readJSONSafe<{ pointer?: number }>(progressPath, {
    pointer: 0,
  });
  let pointer = typeof progress.pointer === "number" ? progress.pointer : 0;

  // select items to process this run
  const toProcess: any[] = [];
  for (let i = 0; i < Math.min(maxToProcess, products.length); i++) {
    const idx = (pointer + i) % products.length;
    toProcess.push({ product: products[idx], idx });
  }

  // update pointer for next run
  pointer = (pointer + toProcess.length) % products.length;
  writeJSONSafe(progressPath, { pointer });

  // Build execute promises (cluster will throttle)
  const executePromises = toProcess.map(async ({ product, idx }) => {
    const productUrl = buildProductUrl(product);
    const sku = product.barcode || null;

    try {
      const scraped = await scrapeProductWithCluster(productUrl);
      const isBuyBox =
        scraped &&
        scraped.seller &&
        SELLER_NAME &&
        scraped.seller.toLowerCase().includes(SELLER_NAME.toLowerCase());

      console.log("SCRAPED", scraped, "ISBUYBOX", isBuyBox);

      return {
        productContentId: product.productContentId,
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

  // Run them in parallel (cluster will handle concurrency limits)
  const settled = await Promise.all(executePromises);
  results.push(...settled);
  return results;
}

// ---------- Public HTTP handler (on-demand) ----------
const getInventory = async (req: Request, res: Response) => {
  try {
    // Fetch your inventory from Trendyol
    const { data } = await trendyol.get(
      `/integration/product/sellers/${SELLER_ID}/products`,
      { params: { page: 0, size: 1000 } }
    );

    // const products = data?.content || [];
    const products = await Product.find({});
    console.log("[getInventory] fetched products:", products.length);

    // If query param ?all=true then process all products
    const all = req.query.all === "true" || false;
    const maxToProcess = all ? products.length : BATCH_SIZE;

    const results = await processProducts(products, { maxToProcess });

    res.json({ processed: results.length, products });

    // res.json({ processed: results.length, results });
  } catch (err: any) {
    console.error(
      "[getInventory] error:",
      err.response?.data || err.message || err
    );
    res
      .status(500)
      .json({ error: "Failed to process buybox check", details: err.message });
  }
};

// ---------- Price update (kept from original) ----------
async function updatePrice(sku: string, newPrice: number) {
  try {
    const { data } = await trendyol.put(
      `/suppliers/${SELLER_ID}/products/price-and-inventory`,
      [
        {
          barcode: sku,
          quantity: 100,
          listPrice: newPrice,
          salePrice: newPrice,
        },
      ]
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
      { params: { page: 0, size: 1000 } }
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
    console.log(
      `[scheduler] processed ${results.length} items; sample:`,
      results.slice(0, 5)
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

// ---------- Update products ----------
cron.schedule("*/10 * * * *", async () => {
  console.log("[scheduler] job started");
  // const products = await Product.find()
  //   .sort({ lasBuyBoxCheckedAt: 1 })
  //   .limit(5);
  const { data } = await trendyol.get(
    `/integration/product/sellers/${SELLER_ID}/products`,
    { params: { page: 0, size: 1000 } }
  );

  const products = data?.content || [];

  for (const p of products) {
    try {
      await saveProductData({ productId: p.productId });
      console.log(`[scheduler] updated ${p.productId}`);
    } catch (e) {
      console.error(`[scheduler] failed ${p.productId}:`, e.message);
    }
  }
});

// Export module API
module.exports = {
  getInventory,
  updatePrice,
  // Also export helpers in case you want to call them externally:
  _internal: {
    initCluster,
    scrapeProductWithCluster,
    processProducts,
  },
};

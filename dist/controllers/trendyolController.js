"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var path = require("path");
var fs = require("fs");
var slugify_1 = require("slugify");
var tough_cookie_1 = require("tough-cookie");
var axios_cookiejar_support_1 = require("axios-cookiejar-support");
var puppeteer_cluster_1 = require("puppeteer-cluster");
var puppeteerCore = require("puppeteer-core");
var puppeteer = require("puppeteer");
var chromium = require("@sparticuz/chromium");
var node_cron_1 = require("node-cron");
var Product_1 = require("../model/Product");
var ExcludedProducts_1 = require("../model/ExcludedProducts");
var ProcessingProgress_1 = require("../model/ProcessingProgress");
var jar = new tough_cookie_1.CookieJar();
var client = (0, axios_cookiejar_support_1.wrapper)(axios_1.default.create({ jar: jar }));
// ================== Credentials / Config ==================
var SELLER_ID = process.env.TRENDYOL_SELLER_ID || "";
var API_KEY = process.env.TRENDYOL_API_KEY || "";
var API_SECRET = process.env.TRENDYOL_API_SECRET || "";
var SELLER_NAME = process.env.TRENDYOL_SELLER_NAME || "";
var token = Buffer.from("".concat(API_KEY, ":").concat(API_SECRET)).toString("base64");
var BASE_URL = "https://apigw.trendyol.com";
var trendyol = axios_1.default.create({
    baseURL: BASE_URL,
    headers: {
        "User-Agent": "".concat(SELLER_ID, " - Lady Globe FZC LLC"),
        "Content-Type": "application/json",
        Storefrontcode: "AE",
        Authorization: "Basic ".concat(token),
    },
});
// Local files
var cookiesPath = path.join(process.cwd(), "trendyol_cookies.json");
var userDataDir = path.join(process.cwd(), "puppeteer_profile");
// Runtime config (env overrides)
var CLUSTER_CONCURRENCY = Number(process.env.CLUSTER_CONCURRENCY || 3); // pages in parallel
var BATCH_SIZE = Number(process.env.BATCH_SIZE || 5); // how many products per scheduled run
var HEADLESS = ((_a = process.env.HEADLESS) !== null && _a !== void 0 ? _a : "true") === "true";
var CRON_SCHEDULE = process.env.CRON_SCHEDULE || "*/5 * * * *"; // every 5 minutes
var NAV_TIMEOUT = Number(process.env.NAV_TIMEOUT || 60000); // navigation timeout
// Helper utilities
function sleep(ms) {
    return new Promise(function (r) { return setTimeout(r, ms); });
}
var clusterInstance = null;
var clusterInitInProgress = false;
function normalizeCookieForCDP(cookie) {
    // cookie is likely from puppeteer/normal page.cookies() format or from another browser
    // return an object suitable for Network.setCookie
    var domain = (cookie.domain || cookie.origin || "").replace(/^\./, "");
    var path = cookie.path || "/";
    var expires = cookie.expires
        ? // puppeteer page.cookies() returns expiry in seconds already sometimes
            Math.floor(Number(cookie.expires))
        : undefined;
    // map sameSite -> "None" | "Lax" | "Strict"
    var sameSite = undefined;
    if (cookie.sameSite) {
        var s = String(cookie.sameSite).toLowerCase();
        if (s.includes("none"))
            sameSite = "None";
        else if (s.includes("lax"))
            sameSite = "Lax";
        else if (s.includes("strict"))
            sameSite = "Strict";
    }
    return {
        name: cookie.name,
        value: cookie.value,
        domain: domain || undefined,
        path: path,
        secure: !!cookie.secure,
        httpOnly: !!cookie.httpOnly,
        sameSite: sameSite,
        expires: expires,
    };
}
function setCookiesOnPageWithCDP(page, cookies) {
    return __awaiter(this, void 0, void 0, function () {
        var client, _i, cookies_1, raw, c, params, urlOrigin, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.createCDPSession()];
                case 1:
                    client = _a.sent();
                    _i = 0, cookies_1 = cookies;
                    _a.label = 2;
                case 2:
                    if (!(_i < cookies_1.length)) return [3 /*break*/, 7];
                    raw = cookies_1[_i];
                    c = normalizeCookieForCDP(raw);
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    params = {
                        name: c.name,
                        value: c.value,
                        domain: c.domain,
                        path: c.path,
                        secure: c.secure,
                        httpOnly: c.httpOnly,
                    };
                    if (c.sameSite)
                        params.sameSite = c.sameSite;
                    if (typeof c.expires !== "undefined" && !Number.isNaN(c.expires)) {
                        // CDP expects number (Unix time in seconds)
                        params.expires = Math.floor(Number(c.expires));
                    }
                    // If domain is not present, you can set a url instead (use target page origin)
                    if (!params.domain) {
                        urlOrigin = new URL(page.url() || "https://www.trendyol.com")
                            .origin;
                        params.url = urlOrigin;
                    }
                    return [4 /*yield*/, client.send("Network.setCookie", params)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    // don't fail everything if a single cookie is malformed
                    console.warn("[setCookiesOnPageWithCDP] cookie set failed:", raw.name, (err_1 === null || err_1 === void 0 ? void 0 : err_1.message) || err_1);
                    return [3 /*break*/, 6];
                case 6:
                    _i++;
                    return [3 /*break*/, 2];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function buildProductUrl(p) {
    var slug = (0, slugify_1.default)(p.title || p.name || "", { lower: true, strict: true });
    var brandSlug = (0, slugify_1.default)(p.brand, { lower: true, strict: true });
    return "https://www.trendyol.com/en/".concat(brandSlug, "/").concat(slug, "-p-").concat(p.productContentId);
}
function saveProductData(productData) {
    return __awaiter(this, void 0, void 0, function () {
        var productCode, updateFields;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    productCode = productData.productCode, updateFields = __rest(productData, ["productCode"]);
                    return [4 /*yield*/, Product_1.default.findOneAndUpdate({ productCode: productCode }, { $set: __assign(__assign({}, updateFields), { lastScrapedAt: new Date() }) }, { upsert: true, new: true })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Initialize Puppeteer Cluster using puppeteer-core + @sparticuz/chromium-min
 * Compatible with Render, Railway, Vercel, etc.
 */
function initCluster() {
    return __awaiter(this, void 0, void 0, function () {
        var executablePath, chromiumArgs, defaultViewport_1, err_2;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (clusterInstance)
                        return [2 /*return*/, clusterInstance];
                    chromiumArgs = ["--no-sandbox", "--disable-setuid-sandbox"];
                    if (!(process.env.NODE_ENV === "production")) return [3 /*break*/, 2];
                    return [4 /*yield*/, chromium.executablePath()];
                case 1:
                    executablePath = _a.sent();
                    chromiumArgs = chromium.args;
                    return [3 /*break*/, 3];
                case 2:
                    executablePath = puppeteer.executablePath();
                    _a.label = 3;
                case 3:
                    if (!clusterInitInProgress) return [3 /*break*/, 7];
                    _a.label = 4;
                case 4:
                    if (!(clusterInitInProgress && !clusterInstance)) return [3 /*break*/, 6];
                    return [4 /*yield*/, sleep(200)];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 6: return [2 /*return*/, clusterInstance];
                case 7:
                    clusterInitInProgress = true;
                    console.log("[scraper] Initializing Puppeteer Cluster...");
                    _a.label = 8;
                case 8:
                    _a.trys.push([8, 11, 12, 13]);
                    defaultViewport_1 = { width: 1280, height: 900 };
                    return [4 /*yield*/, puppeteer_cluster_1.Cluster.launch({
                            concurrency: puppeteer_cluster_1.Cluster.CONCURRENCY_PAGE,
                            maxConcurrency: CLUSTER_CONCURRENCY,
                            puppeteer: puppeteerCore,
                            puppeteerOptions: {
                                headless: HEADLESS,
                                executablePath: executablePath,
                                args: chromiumArgs,
                                userDataDir: userDataDir,
                            },
                            timeout: NAV_TIMEOUT * 2,
                            monitor: false,
                        })];
                case 9:
                    clusterInstance = _a.sent();
                    // ------------------ Cluster Task ------------------
                    return [4 /*yield*/, clusterInstance.task(function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                            var cookies, e_1, e_2, cookies, err_3, result;
                            var _this = this;
                            var page = _b.page, url = _b.data.url;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        page.setDefaultNavigationTimeout(NAV_TIMEOUT);
                                        return [4 /*yield*/, page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36")];
                                    case 1:
                                        _c.sent();
                                        return [4 /*yield*/, page.setExtraHTTPHeaders({ "Accept-Language": "en-US,en;q=0.9" })];
                                    case 2:
                                        _c.sent();
                                        return [4 /*yield*/, page.setViewport(defaultViewport_1)];
                                    case 3:
                                        _c.sent();
                                        _c.label = 4;
                                    case 4:
                                        _c.trys.push([4, 7, , 8]);
                                        if (!fs.existsSync(cookiesPath)) return [3 /*break*/, 6];
                                        cookies = JSON.parse(fs.readFileSync(cookiesPath, "utf8"));
                                        if (!(Array.isArray(cookies) && cookies.length)) return [3 /*break*/, 6];
                                        return [4 /*yield*/, page.setCookie.apply(page, cookies)];
                                    case 5:
                                        _c.sent();
                                        _c.label = 6;
                                    case 6: return [3 /*break*/, 8];
                                    case 7:
                                        e_1 = _c.sent();
                                        console.warn("[task] failed to set cookies:", e_1.message);
                                        return [3 /*break*/, 8];
                                    case 8:
                                        _c.trys.push([8, 10, , 12]);
                                        return [4 /*yield*/, page.goto(url, { waitUntil: "networkidle2", timeout: NAV_TIMEOUT })];
                                    case 9:
                                        _c.sent();
                                        return [3 /*break*/, 12];
                                    case 10:
                                        e_2 = _c.sent();
                                        console.warn("[task] goto failed, retrying:", e_2.message);
                                        return [4 /*yield*/, page.goto(url, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT })];
                                    case 11:
                                        _c.sent();
                                        return [3 /*break*/, 12];
                                    case 12:
                                        if (!page.url().includes("/select-country")) return [3 /*break*/, 22];
                                        console.log("[task] Detected /select-country page — auto-selecting UAE...");
                                        _c.label = 13;
                                    case 13:
                                        _c.trys.push([13, 21, , 22]);
                                        return [4 /*yield*/, page.waitForSelector('[data-testid="country-select"]', { timeout: 10000 })];
                                    case 14:
                                        _c.sent();
                                        return [4 /*yield*/, page.waitForSelector('[data-testid="country-select-btn"]', { timeout: 10000 })];
                                    case 15:
                                        _c.sent();
                                        return [4 /*yield*/, page.select('[data-testid="country-select"]', "United Arab Emirates")];
                                    case 16:
                                        _c.sent();
                                        console.log("[task] Selected United Arab Emirates");
                                        return [4 /*yield*/, page.click('[data-testid="country-select-btn"]')];
                                    case 17:
                                        _c.sent();
                                        console.log("[task] Clicked Select button...");
                                        // Wait for redirect after selection
                                        return [4 /*yield*/, page.waitForNavigation({ waitUntil: "networkidle2", timeout: 30000 })];
                                    case 18:
                                        // Wait for redirect after selection
                                        _c.sent();
                                        return [4 /*yield*/, page.cookies()];
                                    case 19:
                                        cookies = _c.sent();
                                        fs.writeFileSync(cookiesPath, JSON.stringify(cookies, null, 2), "utf8");
                                        console.log("[task] UAE selected & cookies saved.");
                                        // Reload original product page
                                        return [4 /*yield*/, page.goto(url, { waitUntil: "networkidle2" })];
                                    case 20:
                                        // Reload original product page
                                        _c.sent();
                                        return [3 /*break*/, 22];
                                    case 21:
                                        err_3 = _c.sent();
                                        console.error("[task] Auto-select UAE failed:", err_3.message || err_3);
                                        return [2 /*return*/, false];
                                    case 22:
                                        // Handle unexpected redirects
                                        page.on("framenavigated", function (frame) { return __awaiter(_this, void 0, void 0, function () {
                                            var u;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        u = frame.url();
                                                        if (!u.includes("partner.trendyol.com")) return [3 /*break*/, 2];
                                                        console.warn("[task] Redirect detected; navigating back.");
                                                        return [4 /*yield*/, page.goto(url, { waitUntil: "networkidle2" })];
                                                    case 1:
                                                        _a.sent();
                                                        _a.label = 2;
                                                    case 2: return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                        return [4 /*yield*/, page.evaluate(function () {
                                                var getText = function (sel) {
                                                    var el = document.querySelector(sel);
                                                    return el ? el.textContent.trim() : null;
                                                };
                                                var title = getText("h1.pr-new-br, h1.product-title, h1");
                                                var salePrice = getText("div.pr-bx-nm span.prc-slg, div.p-sale-price");
                                                var seller = getText("div.store-link-header, div.merchant-name, .merchant, a[href*='/sellers/']") || getText("a.store-link");
                                                return { title: title, salePrice: salePrice, seller: seller, url: window.location.href };
                                            })];
                                    case 23:
                                        result = _c.sent();
                                        console.log("[task] RESULT:", result);
                                        return [2 /*return*/, result];
                                }
                            });
                        }); })];
                case 10:
                    // ------------------ Cluster Task ------------------
                    _a.sent();
                    // Graceful shutdown
                    process.on("SIGINT", function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log("[scraper] SIGINT — closing cluster...");
                                    if (!clusterInstance) return [3 /*break*/, 2];
                                    return [4 /*yield*/, clusterInstance.close()];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2:
                                    process.exit(0);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    console.log("[scraper] Puppeteer Cluster initialized.");
                    return [2 /*return*/, clusterInstance];
                case 11:
                    err_2 = _a.sent();
                    clusterInitInProgress = false;
                    console.error("[initCluster] Failed to launch cluster:", err_2);
                    throw err_2;
                case 12:
                    clusterInitInProgress = false;
                    return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    });
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
function scrapeProductWithCluster(url) {
    return __awaiter(this, void 0, void 0, function () {
        var cluster, result, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, initCluster()];
                case 1:
                    cluster = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, cluster.execute({ url: url })];
                case 3:
                    result = _a.sent();
                    // console.log("[scrapeProductWithCluster] scrape result:", result);
                    return [2 /*return*/, result];
                case 4:
                    err_4 = _a.sent();
                    console.warn("[scrapeProductWithCluster] scrape failed for", url, err_4.message || err_4);
                    throw err_4;
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Process products array - either batch (BATCH_SIZE) or all if requested
function processProducts(products, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var maxToProcess, results, excludedProducts, excludedCodes, filteredProducts, progressDoc, pointer, toProcess, i, idx, newPointer, executePromises, settled;
        var _this = this;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    maxToProcess = (_a = opts === null || opts === void 0 ? void 0 : opts.maxToProcess) !== null && _a !== void 0 ? _a : products.length;
                    results = [];
                    return [4 /*yield*/, ExcludedProducts_1.default.find({}, "productCode").lean()];
                case 1:
                    excludedProducts = _b.sent();
                    excludedCodes = new Set(excludedProducts.map(function (p) { return p.productCode; }));
                    filteredProducts = products.filter(function (p) { return !excludedCodes.has(p.productCode); });
                    if (filteredProducts.length === 0) {
                        console.log("[processProducts] No products left after exclusion — exiting early.");
                        return [2 /*return*/, []];
                    }
                    return [4 /*yield*/, ProcessingProgress_1.default.findOneAndUpdate({ key: "trendyol_progress" }, { $setOnInsert: { pointer: 0 } }, { upsert: true, new: true })];
                case 2:
                    progressDoc = _b.sent();
                    pointer = progressDoc.pointer || 0;
                    toProcess = [];
                    for (i = 0; i < Math.min(maxToProcess, filteredProducts.length); i++) {
                        idx = (pointer + i) % filteredProducts.length;
                        toProcess.push({ product: filteredProducts[idx], idx: idx });
                    }
                    newPointer = pointer + toProcess.length;
                    if (newPointer >= filteredProducts.length) {
                        newPointer = 0;
                    }
                    else {
                        newPointer = newPointer % filteredProducts.length;
                    }
                    return [4 /*yield*/, ProcessingProgress_1.default.updateOne({ key: "trendyol_progress" }, { $set: { pointer: newPointer } })];
                case 3:
                    _b.sent();
                    console.log("[processProducts] Batch start=".concat(pointer, ", next=").concat(newPointer, ", size=").concat(toProcess.length, "/").concat(filteredProducts.length));
                    executePromises = toProcess.map(function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                        var productUrl, sku, scraped, isBuyBox, err_5;
                        var product = _b.product;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    productUrl = buildProductUrl(product);
                                    sku = product.barcode || null;
                                    _c.label = 1;
                                case 1:
                                    _c.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, scrapeProductWithCluster(productUrl)];
                                case 2:
                                    scraped = _c.sent();
                                    isBuyBox = scraped &&
                                        scraped.seller &&
                                        SELLER_NAME &&
                                        scraped.seller.toLowerCase().includes(SELLER_NAME.toLowerCase());
                                    return [2 /*return*/, {
                                            productContentId: product.productContentId,
                                            productCode: product.productCode,
                                            barcode: product.barcode,
                                            sku: sku,
                                            title: (scraped === null || scraped === void 0 ? void 0 : scraped.title) || product.title,
                                            brand: product.brand,
                                            categoryName: product.categoryName,
                                            quantity: product.quantity || 0,
                                            salePrice: (scraped === null || scraped === void 0 ? void 0 : scraped.salePrice) || product.listPrice,
                                            buyBox: isBuyBox ? "Yes" : "No",
                                            merchant: (scraped === null || scraped === void 0 ? void 0 : scraped.seller) || "Unknown",
                                            url: (scraped === null || scraped === void 0 ? void 0 : scraped.url) || productUrl,
                                            error: null,
                                        }];
                                case 3:
                                    err_5 = _c.sent();
                                    return [2 /*return*/, {
                                            productContentId: product.productContentId,
                                            productCode: product.productCode,
                                            barcode: product.barcode,
                                            sku: sku,
                                            title: product.title,
                                            brand: product.brand,
                                            categoryName: product.categoryName,
                                            quantity: product.quantity || 0,
                                            salePrice: product.listPrice,
                                            buyBox: "Unknown",
                                            merchant: "Unknown",
                                            url: productUrl,
                                            error: (err_5 === null || err_5 === void 0 ? void 0 : err_5.message) || "Scrape failed",
                                        }];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(executePromises)];
                case 4:
                    settled = _b.sent();
                    results.push.apply(results, settled);
                    return [2 /*return*/, results];
            }
        });
    });
}
// ---------- Public HTTP handler (on-demand) ----------
var getInventory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var products, err_6;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Product_1.default.aggregate([
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
                    ])];
            case 1:
                products = _b.sent();
                res.json({ items: products.length, products: products });
                return [3 /*break*/, 3];
            case 2:
                err_6 = _b.sent();
                console.error("[getInventory] error:", ((_a = err_6.response) === null || _a === void 0 ? void 0 : _a.data) || err_6.message || err_6);
                res
                    .status(500)
                    .json({ error: "Failed get products inventory", details: err_6.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// ---------- Price update (kept from original) ----------
function handleUpdatePrice(barcode, newPrice, quantity, product_id, productCode) {
    return __awaiter(this, void 0, void 0, function () {
        var data, product, err_7;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, trendyol.post("/integration/inventory/sellers/".concat(SELLER_ID, "/products/price-and-inventory"), {
                            items: [
                                {
                                    barcode: barcode,
                                    quantity: typeof quantity === "number" ? quantity : "",
                                    listPrice: newPrice,
                                    salePrice: newPrice,
                                },
                            ],
                        })];
                case 1:
                    data = (_b.sent()).data;
                    console.log("[parameters to update product", {
                        product_id: product_id,
                        productCode: productCode,
                        newPrice: newPrice,
                    });
                    return [4 /*yield*/, Product_1.default.findOneAndUpdate({ productCode: productCode }, {
                            $set: {
                                listPrice: newPrice,
                                salePrice: newPrice,
                                lastUpdatedAt: new Date(),
                            },
                        }, { new: true })];
                case 2:
                    product = _b.sent();
                    return [2 /*return*/, data];
                case 3:
                    err_7 = _b.sent();
                    console.error("[updatePrice] Price update failed:", ((_a = err_7.response) === null || _a === void 0 ? void 0 : _a.data) || err_7.message);
                    return [2 /*return*/, { error: "Failed to update price" }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
var updatePrice = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, barcode, newPrice, quantity, product_id, productCode, result, err_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, barcode = _a.barcode, newPrice = _a.newPrice, quantity = _a.quantity, product_id = _a.product_id, productCode = _a.productCode;
                if (!barcode || typeof newPrice !== "number") {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ error: "Missing required fields: barcode, newPrice (number)" })];
                }
                return [4 /*yield*/, handleUpdatePrice(barcode, newPrice, quantity, product_id, productCode)];
            case 1:
                result = _b.sent();
                if (result === null || result === void 0 ? void 0 : result.error) {
                    return [2 /*return*/, res.status(500).json({
                            error: "Failed to update price on Trendyol",
                            details: result.error,
                        })];
                }
                res.json({ message: "Price updated successfully", result: result });
                return [3 /*break*/, 3];
            case 2:
                err_8 = _b.sent();
                console.error("[updatePriceController] error:", err_8.message || err_8);
                res
                    .status(500)
                    .json({ error: "Internal server error", details: err_8.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var addExcludedProduct = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, productCode, reason, addedBy, product, err_9;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, productCode = _a.productCode, reason = _a.reason, addedBy = _a.addedBy;
                if (!productCode)
                    return [2 /*return*/, res.status(400).json({ error: "productCode is required" })];
                return [4 /*yield*/, ExcludedProducts_1.default.findOneAndUpdate({ productCode: productCode }, { $set: { reason: reason, addedBy: addedBy } }, { upsert: true, new: true })];
            case 1:
                product = _b.sent();
                res.json({ message: "Product excluded successfully", product: product });
                return [3 /*break*/, 3];
            case 2:
                err_9 = _b.sent();
                res.status(500).json({
                    error: "Failed to exclude product",
                    details: err_9.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var removeExcludedProduct = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, productCode, deleted, err_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                productCode = id;
                console.log("[removeExcludedProduct] productCode:", productCode);
                return [4 /*yield*/, ExcludedProducts_1.default.findOneAndDelete({ productCode: productCode })];
            case 1:
                deleted = _a.sent();
                if (!deleted)
                    return [2 /*return*/, res
                            .status(404)
                            .json({ error: "Product not found in exclusion list" })];
                res.json({ message: "Product removed from exclusion list", deleted: deleted });
                return [3 /*break*/, 3];
            case 2:
                err_10 = _a.sent();
                res.status(500).json({
                    error: "Failed to remove product from exclusion list",
                    details: err_10.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getExcludedProducts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var products, err_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, ExcludedProducts_1.default.find({})];
            case 1:
                products = _a.sent();
                res.json({ items: products.length, products: products });
                return [3 /*break*/, 3];
            case 2:
                err_11 = _a.sent();
                res.status(500).json({
                    error: "Failed to fetch excluded products",
                    details: err_11.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
/**
 * Fetch and store all Trendyol products for this seller.
 * Can be reused manually or by cron.
 */
function fetchAndStoreTrendyolProducts() {
    return __awaiter(this, void 0, void 0, function () {
        var data, products, _i, products_1, p, e_3, err_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("[trendyol] Fetch job started");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 9, , 10]);
                    return [4 /*yield*/, trendyol.get("/integration/product/sellers/".concat(SELLER_ID, "/products"), { params: { page: 0, size: 5000, onSale: true } })];
                case 2:
                    data = (_a.sent()).data;
                    products = (data === null || data === void 0 ? void 0 : data.content) || [];
                    console.log("[trendyol] fetched ".concat(products.length, " products"));
                    _i = 0, products_1 = products;
                    _a.label = 3;
                case 3:
                    if (!(_i < products_1.length)) return [3 /*break*/, 8];
                    p = products_1[_i];
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, saveProductData(__assign({ productCode: p.productCode }, p))];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    e_3 = _a.sent();
                    console.error("[trendyol] failed productCode=".concat(p.productCode, ":"), e_3.message);
                    return [3 /*break*/, 7];
                case 7:
                    _i++;
                    return [3 /*break*/, 3];
                case 8:
                    console.log("[trendyol] processed ".concat(products.length, " products"));
                    return [3 /*break*/, 10];
                case 9:
                    err_12 = _a.sent();
                    console.error("[trendyol] fetch job failed:", err_12.message);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
// ---------- Scheduler ----------
// Cron job: runs every CRON_SCHEDULE (default every 5 minutes).
function scheduledJob() {
    return __awaiter(this, void 0, void 0, function () {
        var data, products, results, _i, results_1, r, competitivePrice, err_13, e_4;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 11, , 12]);
                    console.log("[scheduler] scheduled job started at", new Date().toISOString());
                    return [4 /*yield*/, trendyol.get("/integration/product/sellers/".concat(SELLER_ID, "/products"), { params: { page: 0, size: 5000, onSale: true } })];
                case 1:
                    data = (_e.sent()).data;
                    products = (data === null || data === void 0 ? void 0 : data.content) || [];
                    if (!products.length) {
                        console.warn("[scheduler] no products returned from API");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, processProducts(products, {
                            maxToProcess: BATCH_SIZE,
                        })];
                case 2:
                    results = _e.sent();
                    console.log("[scheduler] processed ".concat(results.length, " items:"), results);
                    _i = 0, results_1 = results;
                    _e.label = 3;
                case 3:
                    if (!(_i < results_1.length)) return [3 /*break*/, 10];
                    r = results_1[_i];
                    _e.label = 4;
                case 4:
                    _e.trys.push([4, 8, , 9]);
                    if (!r || !r.productCode)
                        return [3 /*break*/, 9]; // skip invalid results
                    return [4 /*yield*/, Product_1.default.findOneAndUpdate({ productCode: r.productCode }, // or productCode, depending on your ID mapping
                        {
                            $set: {
                                title: r.title,
                                price: (_a = r.salePrice) !== null && _a !== void 0 ? _a : r.price,
                                buyboxOwner: (_b = r.merchant) !== null && _b !== void 0 ? _b : r.buyboxOwner,
                                seller: (_c = r.seller) !== null && _c !== void 0 ? _c : r.merchant,
                                quantity: (_d = r.stock) !== null && _d !== void 0 ? _d : r.quantity,
                                isBuyBox: r.buyBox === "Yes",
                                lastScrapedAt: new Date(),
                                productUrl: r.url,
                            },
                        }, { new: true })];
                case 5:
                    _e.sent();
                    if (!(r.buyBox !== "Yes" &&
                        r.barcode &&
                        r.salePrice &&
                        r.error === null)) return [3 /*break*/, 7];
                    competitivePrice = Number((r.salePrice - 0.1).toFixed(2));
                    console.log("[scheduler] updating price for productCode=".concat(r.productCode, ", sku=").concat(r.sku, " to ").concat(competitivePrice));
                    // barcode,
                    // newPrice,
                    // quantity,
                    // product_id,
                    // productCode
                    return [4 /*yield*/, handleUpdatePrice(r.barcode, competitivePrice, r.quantity, r._id, r.productCode)];
                case 6:
                    // barcode,
                    // newPrice,
                    // quantity,
                    // product_id,
                    // productCode
                    _e.sent();
                    _e.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    err_13 = _e.sent();
                    console.error("[scraper] failed to update product ".concat(r.productId, ":"), err_13.message);
                    return [3 /*break*/, 9];
                case 9:
                    _i++;
                    return [3 /*break*/, 3];
                case 10:
                    console.log("[scraper] updated ".concat(results.length, " scraped products in MongoDB."));
                    return [3 /*break*/, 12];
                case 11:
                    e_4 = _e.sent();
                    console.error("[scheduler] failed:", e_4.message || e_4);
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    });
}
function startScheduler() {
    console.log("[scheduler] starting cron schedule: ".concat(CRON_SCHEDULE));
    node_cron_1.default.schedule(CRON_SCHEDULE, function () {
        scheduledJob().catch(function (e) { return console.error("[scheduler] job error:", e); });
    });
}
// ---------- Initialization ----------
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var e_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                // initialize cluster (but don't force heavy tasks yet)
                return [4 /*yield*/, initCluster()];
            case 1:
                // initialize cluster (but don't force heavy tasks yet)
                _a.sent();
                // Start the scheduler for background processing
                startScheduler();
                console.log("[scraper] module ready. getInventory exported for on-demand runs.");
                return [3 /*break*/, 3];
            case 2:
                e_5 = _a.sent();
                console.error("[scraper] initialization failed:", e_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); })();
/**
 * Schedule to run every 60 minutes
 */
node_cron_1.default.schedule("*/60 * * * *", function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchAndStoreTrendyolProducts()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
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
    getInventory: getInventory,
    updatePrice: updatePrice,
    addExcludedProduct: addExcludedProduct,
    getExcludedProducts: getExcludedProducts,
    removeExcludedProduct: removeExcludedProduct,
    // Also export helpers in case you want to call them externally:
    _internal: {
        initCluster: initCluster,
        scrapeProductWithCluster: scrapeProductWithCluster,
        processProducts: processProducts,
    },
};

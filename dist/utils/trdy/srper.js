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
var puppeteer_1 = require("puppeteer");
var node_cron_1 = require("node-cron");
var Product_1 = require("../model/Product");
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
        Authorization: "Bearer ".concat(token),
    },
});
// Local files
var cookiesPath = path.join(process.cwd(), "trendyol_cookies.json");
var userDataDir = path.join(process.cwd(), "puppeteer_profile");
var progressPath = path.join(process.cwd(), "progress.json");
// Runtime config (env overrides)
var CLUSTER_CONCURRENCY = Number(process.env.CLUSTER_CONCURRENCY || 3); // pages in parallel
var BATCH_SIZE = Number(process.env.BATCH_SIZE || 5); // how many products per scheduled run
var HEADLESS = ((_a = process.env.HEADLESS) !== null && _a !== void 0 ? _a : "true") === "true";
var CRON_SCHEDULE = process.env.CRON_SCHEDULE || "*/2 * * * *"; // every 5 minutes
var NAV_TIMEOUT = Number(process.env.NAV_TIMEOUT || 60000); // navigation timeout
// Helper utilities
function sleep(ms) {
    return new Promise(function (r) { return setTimeout(r, ms); });
}
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
function readJSONSafe(filePath, fallback) {
    try {
        if (fs.existsSync(filePath)) {
            var txt = fs.readFileSync(filePath, "utf8");
            return JSON.parse(txt);
        }
    }
    catch (e) {
        console.warn("[readJSONSafe] failed to read JSON:", filePath, e.message);
    }
    return fallback;
}
function writeJSONSafe(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    }
    catch (e) {
        console.warn("[writeJSONSafe] failed to write JSON:", filePath, e.message);
    }
}
function buildProductUrl(p) {
    var slug = (0, slugify_1.default)(p.title || p.name || "", { lower: true, strict: true });
    var brandSlug = (0, slugify_1.default)(p.brand, { lower: true, strict: true });
    return "https://www.trendyol.com/en/".concat(brandSlug, "/").concat(slug, "-p-").concat(p.productContentId);
}
function saveProductData(productData) {
    return __awaiter(this, void 0, void 0, function () {
        var productId, updateFields;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    productId = productData.productId, updateFields = __rest(productData, ["productId"]);
                    return [4 /*yield*/, Product_1.default.findOneAndUpdate({ productId: productId }, { $set: __assign(__assign({}, updateFields), { lastScrapedAt: new Date() }) }, { upsert: true, new: true })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// ---------- Cluster / Scraper lifecycle ----------
var clusterInstance = null;
var clusterInitInProgress = false;
function initCluster() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (clusterInstance)
                        return [2 /*return*/, clusterInstance];
                    if (!clusterInitInProgress) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    if (!(clusterInitInProgress && !clusterInstance)) return [3 /*break*/, 3];
                    return [4 /*yield*/, sleep(200)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/, clusterInstance];
                case 4:
                    clusterInitInProgress = true;
                    console.log("[scraper] Initializing Puppeteer Cluster...");
                    return [4 /*yield*/, puppeteer_cluster_1.Cluster.launch({
                            concurrency: puppeteer_cluster_1.Cluster.CONCURRENCY_PAGE,
                            maxConcurrency: CLUSTER_CONCURRENCY,
                            puppeteer: puppeteer_1.default,
                            puppeteerOptions: {
                                headless: HEADLESS,
                                userDataDir: userDataDir,
                                args: ["--no-sandbox", "--disable-setuid-sandbox", "--lang=en-US,en"],
                            },
                            timeout: NAV_TIMEOUT * 2, // cluster-level timeout for tasks
                            monitor: false,
                        })];
                case 5:
                    clusterInstance = _a.sent();
                    // Set default task
                    return [4 /*yield*/, clusterInstance.task(function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                            var cookies, e_1, e_2, currentUrl, manualBrowserInstance, setupLockPath, iAmTheSetupOwner, fd, manualBrowser, manualPage, start, maxWait, finished, u, cookies, err_2, _c, waited, maxWait, cookies, err_3, cookies, err_4, result;
                            var _this = this;
                            var page = _b.page, url = _b.data.url;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        // Each task must perform: ensure locale (if needed), navigate, extract
                                        page.setDefaultNavigationTimeout(NAV_TIMEOUT);
                                        page.setExtraHTTPHeaders({ "Accept-Language": "en-US,en;q=0.9" });
                                        return [4 /*yield*/, page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36")];
                                    case 1:
                                        _d.sent();
                                        return [4 /*yield*/, page.setViewport({ width: 1280, height: 900 })];
                                    case 2:
                                        _d.sent();
                                        _d.label = 3;
                                    case 3:
                                        _d.trys.push([3, 6, , 7]);
                                        if (!fs.existsSync(cookiesPath)) return [3 /*break*/, 5];
                                        cookies = JSON.parse(fs.readFileSync(cookiesPath, "utf8"));
                                        if (!(Array.isArray(cookies) && cookies.length)) return [3 /*break*/, 5];
                                        // ensure domain compatibility
                                        return [4 /*yield*/, page.setCookie.apply(page, cookies)];
                                    case 4:
                                        // ensure domain compatibility
                                        _d.sent();
                                        _d.label = 5;
                                    case 5: return [3 /*break*/, 7];
                                    case 6:
                                        e_1 = _d.sent();
                                        console.warn("[task] failed to set cookies:", e_1.message);
                                        return [3 /*break*/, 7];
                                    case 7:
                                        _d.trys.push([7, 9, , 11]);
                                        return [4 /*yield*/, page.goto(url, { waitUntil: "networkidle2", timeout: NAV_TIMEOUT })];
                                    case 8:
                                        _d.sent();
                                        return [3 /*break*/, 11];
                                    case 9:
                                        e_2 = _d.sent();
                                        console.warn("[task] goto failed, retrying once:", e_2.message);
                                        return [4 /*yield*/, page.goto(url, {
                                                waitUntil: "domcontentloaded",
                                                timeout: NAV_TIMEOUT,
                                            })];
                                    case 10:
                                        _d.sent();
                                        return [3 /*break*/, 11];
                                    case 11:
                                        currentUrl = page.url();
                                        manualBrowserInstance = null;
                                        if (!currentUrl.includes("/select-country")) return [3 /*break*/, 44];
                                        console.log("[task] select-country detected...");
                                        if (!!fs.existsSync(cookiesPath)) return [3 /*break*/, 39];
                                        console.log("[task] No cookies found — performing manual setup (one worker will do this)...");
                                        setupLockPath = path.join(process.cwd(), "cookie_setup.lock");
                                        iAmTheSetupOwner = false;
                                        try {
                                            fd = fs.openSync(setupLockPath, "wx");
                                            fs.writeSync(fd, Date.now().toString());
                                            fs.closeSync(fd);
                                            iAmTheSetupOwner = true;
                                        }
                                        catch (_e) {
                                            console.log("[task] Another worker is performing cookie setup; waiting for cookies...");
                                        }
                                        if (!iAmTheSetupOwner) return [3 /*break*/, 28];
                                        return [4 /*yield*/, puppeteer_1.default.launch({
                                                headless: false,
                                                defaultViewport: null,
                                                args: ["--no-sandbox", "--disable-setuid-sandbox"],
                                            })];
                                    case 12:
                                        manualBrowser = _d.sent();
                                        _d.label = 13;
                                    case 13:
                                        _d.trys.push([13, 22, 23, 27]);
                                        return [4 /*yield*/, manualBrowser.newPage()];
                                    case 14:
                                        manualPage = _d.sent();
                                        return [4 /*yield*/, manualPage.goto(currentUrl, {
                                                waitUntil: "domcontentloaded",
                                            })];
                                    case 15:
                                        _d.sent();
                                        start = Date.now();
                                        maxWait = 1000 * 60 * 5;
                                        finished = false;
                                        _d.label = 16;
                                    case 16:
                                        if (!(Date.now() - start < maxWait && !finished)) return [3 /*break*/, 18];
                                        try {
                                            u = manualPage.url();
                                            if (!u.includes("/select-country")) {
                                                finished = true;
                                                return [3 /*break*/, 18];
                                            }
                                        }
                                        catch (err) {
                                            // page might be navigated/temporarily unavailable; continue polling
                                        }
                                        return [4 /*yield*/, sleep(2000)];
                                    case 17:
                                        _d.sent();
                                        return [3 /*break*/, 16];
                                    case 18:
                                        if (!!finished) return [3 /*break*/, 19];
                                        console.warn("[task] Manual cookie setup timed out after waiting.");
                                        return [3 /*break*/, 21];
                                    case 19: return [4 /*yield*/, manualPage.cookies()];
                                    case 20:
                                        cookies = _d.sent();
                                        fs.writeFileSync(cookiesPath, JSON.stringify(cookies, null, 2), "utf8");
                                        console.log("[task] ✅ Cookies saved to trendyol_cookies.json");
                                        _d.label = 21;
                                    case 21: return [3 /*break*/, 27];
                                    case 22:
                                        err_2 = _d.sent();
                                        console.error("[task] Manual setup failed:", err_2.message || err_2);
                                        return [3 /*break*/, 27];
                                    case 23:
                                        _d.trys.push([23, 25, , 26]);
                                        return [4 /*yield*/, manualBrowser.close()];
                                    case 24:
                                        _d.sent();
                                        return [3 /*break*/, 26];
                                    case 25:
                                        _c = _d.sent();
                                        return [3 /*break*/, 26];
                                    case 26:
                                        if (fs.existsSync(setupLockPath))
                                            fs.unlinkSync(setupLockPath);
                                        return [7 /*endfinally*/];
                                    case 27: return [3 /*break*/, 31];
                                    case 28:
                                        waited = 0;
                                        maxWait = 180000;
                                        _d.label = 29;
                                    case 29:
                                        if (!(!fs.existsSync(cookiesPath) && waited < maxWait)) return [3 /*break*/, 31];
                                        return [4 /*yield*/, sleep(2000)];
                                    case 30:
                                        _d.sent();
                                        waited += 2000;
                                        return [3 /*break*/, 29];
                                    case 31:
                                        if (!fs.existsSync(cookiesPath)) return [3 /*break*/, 37];
                                        _d.label = 32;
                                    case 32:
                                        _d.trys.push([32, 35, , 36]);
                                        cookies = JSON.parse(fs.readFileSync(cookiesPath, "utf8"));
                                        return [4 /*yield*/, setCookiesOnPageWithCDP(page, cookies)];
                                    case 33:
                                        _d.sent();
                                        // reload
                                        return [4 /*yield*/, page.goto(url, { waitUntil: "networkidle2" })];
                                    case 34:
                                        // reload
                                        _d.sent();
                                        return [3 /*break*/, 36];
                                    case 35:
                                        err_3 = _d.sent();
                                        console.warn("[task] failed to apply cookies after setup:", err_3.message || err_3);
                                        return [2 /*return*/, false];
                                    case 36: return [3 /*break*/, 38];
                                    case 37:
                                        console.warn("[task] Timeout waiting for cookies — skipping URL.");
                                        return [2 /*return*/, false];
                                    case 38: return [3 /*break*/, 44];
                                    case 39:
                                        // Cookies already exist -> apply them via CDP and continue
                                        console.log("[task] Cookies already exist — applying them.");
                                        _d.label = 40;
                                    case 40:
                                        _d.trys.push([40, 43, , 44]);
                                        cookies = JSON.parse(fs.readFileSync(cookiesPath, "utf8"));
                                        return [4 /*yield*/, setCookiesOnPageWithCDP(page, cookies)];
                                    case 41:
                                        _d.sent();
                                        return [4 /*yield*/, page.goto(url, { waitUntil: "networkidle2" })];
                                    case 42:
                                        _d.sent();
                                        return [3 /*break*/, 44];
                                    case 43:
                                        err_4 = _d.sent();
                                        console.warn("[task] failed to apply cookies:", err_4.message || err_4);
                                        return [3 /*break*/, 44];
                                    case 44:
                                        page.on("framenavigated", function (frame) { return __awaiter(_this, void 0, void 0, function () {
                                            var u, e_3;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        _a.trys.push([0, 3, , 4]);
                                                        u = frame.url();
                                                        if (!u.includes("partner.trendyol.com")) return [3 /*break*/, 2];
                                                        console.warn("[task] partner redirect detected; navigating back to product.");
                                                        return [4 /*yield*/, page.goto(url, { waitUntil: "networkidle2" })];
                                                    case 1:
                                                        _a.sent();
                                                        _a.label = 2;
                                                    case 2: return [3 /*break*/, 4];
                                                    case 3:
                                                        e_3 = _a.sent();
                                                        return [3 /*break*/, 4];
                                                    case 4: return [2 /*return*/];
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
                                                console.log("RESULT 1:", {
                                                    title: title,
                                                    salePrice: salePrice,
                                                    seller: seller,
                                                    url: window.location.href,
                                                });
                                                return { title: title, salePrice: salePrice, seller: seller, url: window.location.href };
                                            })];
                                    case 45:
                                        result = _d.sent();
                                        console.log("RESULT", result);
                                        return [2 /*return*/, result];
                                }
                            });
                        }); })];
                case 6:
                    // Set default task
                    _a.sent();
                    // Graceful shutdown on process exit
                    process.on("SIGINT", function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log("[scraper] SIGINT received — shutting cluster down...");
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
                    clusterInitInProgress = false;
                    console.log("[scraper] Puppeteer Cluster initialized.");
                    return [2 /*return*/, clusterInstance];
            }
        });
    });
}
// ---------- Scraper orchestration ----------
function scrapeProductWithCluster(url) {
    return __awaiter(this, void 0, void 0, function () {
        var cluster, result, err_5;
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
                    console.log("[scrapeProductWithCluster] scrape result:", result);
                    return [2 /*return*/, result];
                case 4:
                    err_5 = _a.sent();
                    console.warn("[scrapeProductWithCluster] scrape failed for", url, err_5.message || err_5);
                    throw err_5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Process products array - either batch (BATCH_SIZE) or all if requested
function processProducts(products, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var maxToProcess, results, progress, pointer, toProcess, i, idx, executePromises, settled;
        var _this = this;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    maxToProcess = (_a = opts === null || opts === void 0 ? void 0 : opts.maxToProcess) !== null && _a !== void 0 ? _a : products.length;
                    results = [];
                    progress = readJSONSafe(progressPath, {
                        pointer: 0,
                    });
                    pointer = typeof progress.pointer === "number" ? progress.pointer : 0;
                    toProcess = [];
                    for (i = 0; i < Math.min(maxToProcess, products.length); i++) {
                        idx = (pointer + i) % products.length;
                        toProcess.push({ product: products[idx], idx: idx });
                    }
                    // update pointer for next run
                    pointer = (pointer + toProcess.length) % products.length;
                    writeJSONSafe(progressPath, { pointer: pointer });
                    executePromises = toProcess.map(function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                        var productUrl, sku, scraped, isBuyBox, err_6;
                        var product = _b.product, idx = _b.idx;
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
                                    console.log("SCRAPED", scraped, "ISBUYBOX", isBuyBox);
                                    return [2 /*return*/, {
                                            productContentId: product.productContentId,
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
                                    err_6 = _c.sent();
                                    return [2 /*return*/, {
                                            productContentId: product.productContentId,
                                            sku: sku,
                                            title: product.title,
                                            brand: product.brand,
                                            categoryName: product.categoryName,
                                            quantity: product.quantity || 0,
                                            salePrice: product.listPrice,
                                            buyBox: "Unknown",
                                            merchant: "Unknown",
                                            url: productUrl,
                                            error: (err_6 === null || err_6 === void 0 ? void 0 : err_6.message) || "Scrape failed",
                                        }];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(executePromises)];
                case 1:
                    settled = _b.sent();
                    results.push.apply(results, settled);
                    return [2 /*return*/, results];
            }
        });
    });
}
// ---------- Public HTTP handler (on-demand) ----------
var getInventory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, products, all, maxToProcess, results, err_7;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                return [4 /*yield*/, trendyol.get("/integration/product/sellers/".concat(SELLER_ID, "/products"), { params: { page: 0, size: 1000 } })];
            case 1:
                data = (_b.sent()).data;
                return [4 /*yield*/, Product_1.default.find({})];
            case 2:
                products = _b.sent();
                console.log("[getInventory] fetched products:", products.length);
                all = req.query.all === "true" || false;
                maxToProcess = all ? products.length : BATCH_SIZE;
                return [4 /*yield*/, processProducts(products, { maxToProcess: maxToProcess })];
            case 3:
                results = _b.sent();
                res.json({ processed: results.length, products: products });
                return [3 /*break*/, 5];
            case 4:
                err_7 = _b.sent();
                console.error("[getInventory] error:", ((_a = err_7.response) === null || _a === void 0 ? void 0 : _a.data) || err_7.message || err_7);
                res
                    .status(500)
                    .json({ error: "Failed to process buybox check", details: err_7.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
// ---------- Price update (kept from original) ----------
function updatePrice(sku, newPrice) {
    return __awaiter(this, void 0, void 0, function () {
        var data, err_8;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, trendyol.put("/suppliers/".concat(SELLER_ID, "/products/price-and-inventory"), [
                            {
                                barcode: sku,
                                quantity: 100,
                                listPrice: newPrice,
                                salePrice: newPrice,
                            },
                        ])];
                case 1:
                    data = (_b.sent()).data;
                    return [2 /*return*/, data];
                case 2:
                    err_8 = _b.sent();
                    console.error("[updatePrice] Price update failed:", ((_a = err_8.response) === null || _a === void 0 ? void 0 : _a.data) || err_8.message);
                    return [2 /*return*/, { error: "Failed to update price" }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// ---------- Scheduler ----------
// Cron job: runs every CRON_SCHEDULE (default every 5 minutes).
function scheduledJob() {
    return __awaiter(this, void 0, void 0, function () {
        var data, products, results, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    console.log("[scheduler] scheduled job started at", new Date().toISOString());
                    return [4 /*yield*/, trendyol.get("/integration/product/sellers/".concat(SELLER_ID, "/products"), { params: { page: 0, size: 1000 } })];
                case 1:
                    data = (_a.sent()).data;
                    products = (data === null || data === void 0 ? void 0 : data.content) || [];
                    if (!products.length) {
                        console.warn("[scheduler] no products returned from API");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, processProducts(products, {
                            maxToProcess: BATCH_SIZE,
                        })];
                case 2:
                    results = _a.sent();
                    console.log("[scheduler] processed ".concat(results.length, " items; sample:"), results.slice(0, 5));
                    return [3 /*break*/, 4];
                case 3:
                    e_4 = _a.sent();
                    console.error("[scheduler] failed:", e_4.message || e_4);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
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
// ---------- Update products ----------
node_cron_1.default.schedule("*/10 * * * *", function () { return __awaiter(void 0, void 0, void 0, function () {
    var data, products, _i, products_1, p, e_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("[scheduler] job started");
                return [4 /*yield*/, trendyol.get("/integration/product/sellers/".concat(SELLER_ID, "/products"), { params: { page: 0, size: 1000 } })];
            case 1:
                data = (_a.sent()).data;
                products = (data === null || data === void 0 ? void 0 : data.content) || [];
                _i = 0, products_1 = products;
                _a.label = 2;
            case 2:
                if (!(_i < products_1.length)) return [3 /*break*/, 7];
                p = products_1[_i];
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, saveProductData({ productId: p.productId })];
            case 4:
                _a.sent();
                console.log("[scheduler] updated ".concat(p.productId));
                return [3 /*break*/, 6];
            case 5:
                e_6 = _a.sent();
                console.error("[scheduler] failed ".concat(p.productId, ":"), e_6.message);
                return [3 /*break*/, 6];
            case 6:
                _i++;
                return [3 /*break*/, 2];
            case 7: return [2 /*return*/];
        }
    });
}); });
// Export module API
module.exports = {
    getInventory: getInventory,
    updatePrice: updatePrice,
    // Also export helpers in case you want to call them externally:
    _internal: {
        initCluster: initCluster,
        scrapeProductWithCluster: scrapeProductWithCluster,
        processProducts: processProducts,
    },
};

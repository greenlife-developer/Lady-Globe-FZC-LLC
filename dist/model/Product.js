"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var imageSchema = new mongoose_1.default.Schema({
    url: String,
});
var variantAttributeSchema = new mongoose_1.default.Schema({
    attributeName: String,
    attributeValue: String,
});
var deliveryOptionSchema = new mongoose_1.default.Schema({
    deliveryDuration: Number,
    fastDeliveryType: String, // SAME_DAY_SHIPPING | FAST_DELIVERY
});
var productSchema = new mongoose_1.default.Schema({
    trendyolId: { type: String, index: true }, // field 'id' from Trendyol response
    productCode: { type: String, unique: true, required: true },
    batchRequestId: String,
    supplierId: Number,
    approved: Boolean,
    createDateTime: Date,
    lastUpdateDate: Date,
    gender: String,
    brand: String,
    barcode: String,
    title: String,
    categoryName: String,
    productMainId: String,
    description: String,
    stockUnitType: String,
    quantity: Number,
    listPrice: Number,
    salePrice: Number,
    vatRate: Number,
    dimensionalWeight: Number,
    stockCode: String,
    locationBasedDelivery: { type: String, enum: ["ENABLED", "DISABLED", null], default: null },
    lotNumber: String,
    deliveryOption: deliveryOptionSchema,
    images: [imageSchema],
    attributes: [{ type: Object }], // flexible since Trendyol may return dynamic attributes
    variantAttributes: [variantAttributeSchema],
    platformListingId: String,
    stockId: String,
    color: String,
    productUrl: String,
    url: [{ url: String }], // possibly multiple URLs scraped
    seller: String,
    buyboxOwner: String,
    lastScrapedAt: Date,
    isBuyBox: { type: String, default: "Undetermined" },
    lasBuyBoxCheckedAt: Date,
    createdAt: { type: Date, default: Date.now },
});
exports.default = mongoose_1.default.model("Product", productSchema);

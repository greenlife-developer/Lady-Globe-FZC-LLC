"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var excludedProductSchema = new mongoose_1.default.Schema({
    productCode: { type: String, required: true, unique: true },
    reason: { type: String, default: "" }, // Optional: why it’s excluded
    addedAt: { type: Date, default: Date.now },
    addedBy: { type: String }, // Optional: who excluded it (if multi-user system)
});
exports.default = mongoose_1.default.model("ExcludedProduct", excludedProductSchema);

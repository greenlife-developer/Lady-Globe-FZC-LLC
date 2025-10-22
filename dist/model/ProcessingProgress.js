"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var ProcessingProgressSchema = new mongoose_1.default.Schema({
    key: { type: String, unique: true, required: true },
    pointer: { type: Number, default: 0 },
}, { timestamps: true });
exports.default = mongoose_1.default.model("ProcessingProgress", ProcessingProgressSchema);

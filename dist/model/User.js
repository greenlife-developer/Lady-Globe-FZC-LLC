"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    password: { type: String },
}, { timestamps: { createdAt: true, updatedAt: true } });
var User = mongoose_1.default.model("User", UserSchema);
exports.default = User;

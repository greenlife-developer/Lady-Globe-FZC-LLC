import mongoose from "mongoose";

const excludedProductSchema = new mongoose.Schema({
  productCode: { type: String, required: true, unique: true },
  reason: { type: String, default: "" }, // Optional: why it’s excluded
  addedAt: { type: Date, default: Date.now },
  addedBy: { type: String }, // Optional: who excluded it (if multi-user system)
});

export default mongoose.model("ExcludedProduct", excludedProductSchema);

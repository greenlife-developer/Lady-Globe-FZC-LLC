import mongoose from "mongoose";

const ProcessingProgressSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, required: true },
    pointer: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("ProcessingProgress", ProcessingProgressSchema);

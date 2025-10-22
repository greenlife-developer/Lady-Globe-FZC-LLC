import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  url: String,
});

const variantAttributeSchema = new mongoose.Schema({
  attributeName: String,
  attributeValue: String,
});

const deliveryOptionSchema = new mongoose.Schema({
  deliveryDuration: Number,
  fastDeliveryType: String, // SAME_DAY_SHIPPING | FAST_DELIVERY
});

const productSchema = new mongoose.Schema({
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

export default mongoose.model("Product", productSchema);

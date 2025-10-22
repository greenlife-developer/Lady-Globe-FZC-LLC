const express = require("express");
const router = express.Router();
const {
  getInventory,
  addExcludedProduct,
  removeExcludedProduct,
  getExcludedProducts,
  updatePrice,
} = require("../controllers/trendyolController");

router.get("/get-inventory", getInventory);
router.post("/add-excluded-product", addExcludedProduct);
router.get("/get-excluded-products", getExcludedProducts);
router.post("/remove-excluded-product/:id", removeExcludedProduct);
router.post("/update-price", updatePrice);

module.exports = router;

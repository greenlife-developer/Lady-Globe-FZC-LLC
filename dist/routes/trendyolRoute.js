var express = require("express");
var router = express.Router();
var _a = require("../controllers/trendyolController"), getInventory = _a.getInventory, addExcludedProduct = _a.addExcludedProduct, removeExcludedProduct = _a.removeExcludedProduct, getExcludedProducts = _a.getExcludedProducts, updatePrice = _a.updatePrice;
router.get("/get-inventory", getInventory);
router.post("/add-excluded-product", addExcludedProduct);
router.get("/get-excluded-products", getExcludedProducts);
router.post("/remove-excluded-product/:id", removeExcludedProduct);
router.post("/update-price", updatePrice);
module.exports = router;

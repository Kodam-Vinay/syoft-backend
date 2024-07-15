const express = require("express");
const {
  addProduct,
  deleteProduct,
  getProductById,
  getAllProducts,
  updateProduct,
} = require("../controllers/productController");
const { authorizeUser } = require("../utils/constants");
const router = express.Router();
router.post("/add", authorizeUser, addProduct);
router.get("/all", authorizeUser, getAllProducts);
router.get("/:product_id", authorizeUser, getProductById);
router.put("/:product_id", authorizeUser, updateProduct);
router.delete("/:product_id", authorizeUser, deleteProduct);
module.exports = {
  productRouter: router,
};

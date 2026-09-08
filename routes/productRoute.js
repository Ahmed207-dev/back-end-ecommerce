const express = require("express");
const {
  getProduct,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
} = require("../controllers/productController");

const {
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");

// استيراد ملف مسارات التقييمات
const reviewRoute = require("./reviewRoute");

const router = express.Router();

// 1. توجيه طلبات تقييمات منتج معين إلى reviewRoute
router.use("/:productId/reviews", reviewRoute);

// 2. مسارات المنتجات العامة
router
  .route("/")
  .get(getProducts)
  .post(
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct,
  );

// 3. مسارات المنتج بالـ ID
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct,
  )
  .delete(deleteProductValidator, deleteProduct);

module.exports = router;

const express = require("express");

const {
  addProductToCart,
  getLoggedUserCart,
  removeSpecificCartItem,
  clearCart,
  updateCartItemQuantity,
  applyCoupon, // 1) استيراد الدالة من الـ Controller
} = require("../controllers/cartController");
const { auth, allowedTo } = require("../controllers/authController");

const router = express.Router();

router.use(auth, allowedTo("user"));

router
  .route("/")
  .post(addProductToCart)
  .get(getLoggedUserCart)
  .delete(clearCart);

// 2) وضع مسار الكوبون قبل الـ Dynamic Params (/:itemId)
router.put("/applyCoupon", applyCoupon);

router
  .route("/:itemId")
  .put(updateCartItemQuantity)
  .delete(removeSpecificCartItem);

module.exports = router;

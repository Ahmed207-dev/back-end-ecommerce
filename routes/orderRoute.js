const express = require("express");
const {
  createCashOrder,
  findAllOrders,
  findSpecificOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
  checkoutSession,
} = require("../controllers/orderController");

const { auth, allowedTo } = require("../controllers/authController");

const router = express.Router();

router.use(auth);

// 1) الـ Checkout Session لازم يتحط قبل الـ Routes اللي فيها :id
router.get("/checkout-session/:cartId", allowedTo("user"), checkoutSession);

// 2) إنشاء أوردر كاش
router.post("/:cartId", allowedTo("user"), createCashOrder);

// 3) جلب كل الأوردرات
router.get("/", allowedTo("user", "admin", "manager"), findAllOrders);

// 4) جلب أوردر محدد
router.get("/:id", allowedTo("user", "admin", "manager"), findSpecificOrder);

// 5) تحديث حالة الدفع والتوصيل
router.put("/:id/pay", allowedTo("admin", "manager"), updateOrderToPaid);
router.put(
  "/:id/deliver",
  allowedTo("admin", "manager"),
  updateOrderToDelivered,
);

module.exports = router;

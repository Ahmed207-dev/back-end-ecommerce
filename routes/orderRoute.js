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

// Checkout Session
router.get(
  "/checkout-session/:cartId",
  allowedTo("user"),
  checkoutSession,
);

// Create cash order
router.post(
  "/:cartId",
  allowedTo("user"),
  createCashOrder,
);

// Get all orders
router.get(
  "/",
  allowedTo("user", "admin", "manager"),
  findAllOrders,
);

// Get specific order
router.get(
  "/:id",
  allowedTo("user", "admin", "manager"),
  findSpecificOrder,
);

// Update payment status
router.put(
  "/:id/pay",
  allowedTo("admin", "manager"),
  updateOrderToPaid,
);

// Update delivery status
router.put(
  "/:id/deliver",
  allowedTo("admin", "manager"),
  updateOrderToDelivered,
);

module.exports = router;

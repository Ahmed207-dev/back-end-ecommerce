const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

// @desc    Create cash order
// @route   POST /api/v1/orders/:cartId
// @access  Protected/User
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1) جلب عربة الشراء عن طريق الـ cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`There is no cart with id ${req.params.cartId}`, 404),
    );
  }

  // 2) حساب الإجمالي بناءً على وجود خصم الكوبون أو لا
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3) إنشاء الطلب
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    paymentMethodType: req.body.paymentMethodType || "cash",
    taxPrice,
    shippingPrice,
    totalOrderPrice,
  });

  // 4) خصم الكمية وزيادة الـ sold في الـ Product Model
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});

    // 5) مسح الـ Cart للمستخدم بعد نجاح الأوردر
    await Cart.findByIdAndDelete(req.params.cartId);
  }

  res.status(201).json({ status: "success", data: order });
});

// @desc    Get all orders (Filter by user role + Pagination)
// @route   GET /api/v1/orders
// @access  Protected/User-Admin
exports.findAllOrders = asyncHandler(async (req, res, next) => {
  let filterObj = {};
  if (req.user.role === "user") {
    filterObj = { user: req.user._id };
  }

  // 1) إعدادات الـ Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  // 2) حساب إجمالي المستندات والصفحات
  const countDocuments = await Order.countDocuments(filterObj);
  const numberOfPages = Math.ceil(countDocuments / limit);

  const paginationResult = {
    currentPage: page,
    limit,
    numberOfPages,
  };

  if (page < numberOfPages) {
    paginationResult.next = page + 1;
  }
  if (page > 1) {
    paginationResult.prev = page - 1;
  }

  // 3) استعلام البيانات بالحد والتخطي
  const orders = await Order.find(filterObj).skip(skip).limit(limit);

  res.status(200).json({
    status: "success",
    results: orders.length,
    paginationResult,
    data: orders,
  });
});

// @desc    Get specific order
// @route   GET /api/v1/orders/:id
// @access  Protected/User-Admin
exports.findSpecificOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ApiError(`There is no order with this id ${req.params.id}`, 404),
    );
  }

  res.status(200).json({ status: "success", data: order });
});

// @desc    Update order paid status to paid
// @route   PUT /api/v1/orders/:id/pay
// @access  Protected/Admin-Manager
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(`There is no order with this id ${req.params.id}`, 404),
    );
  }

  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();
  res.status(200).json({ status: "success", data: updatedOrder });
});

// @desc    Update order delivered status
// @route   PUT /api/v1/orders/:id/deliver
// @access  Protected/Admin-Manager
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(`There is no order with this id ${req.params.id}`, 404),
    );
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();
  res.status(200).json({ status: "success", data: updatedOrder });
});

// @desc    Get checkout session from stripe and send it as response
// @route   GET /api/v1/orders/checkout-session/:cartId
// @access  Protected/User
exports.checkoutSession = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1) جلب عربة الشراء عن طريق الـ cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`There is no cart with id ${req.params.cartId}`, 404),
    );
  }

  // 2) حساب إجمالي السعر
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3) إنشاء جلسة دفع في Stripe
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          unit_amount: totalOrderPrice * 100,
          product_data: {
            name: req.user.name,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `http://localhost:5173/user/allorder`,
    cancel_url: `http://localhost:5173/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });

  // 4) إرسال الـ session للعميل
  res.status(200).json({ status: "success", session });
});

const asyncHandler = require("express-async-handler");
const Review = require("../models/reviewModel");
const ApiError = require("../utils/apiError"); // 👈 أضف هذا السطر
exports.createReview = asyncHandler(async (req, res, next) => {
  // 1. ربط المنتَج والمستخدم بالطلب تلقائياً
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user && req.user) req.body.user = req.user._id;

  // 2. مطابقة أسماء الحقول المرسلة من الرياكت مع الموديل
  if (!req.body.title) {
    req.body.title = req.body.review || req.body.comment || "تقييم جديد";
  }
  if (!req.body.rating && req.body.ratings) {
    req.body.rating = req.body.ratings;
  }

  // 3. إنشاء التقييم في MongoDB
  const newReview = await Review.create(req.body);
  res.status(201).json({ status: "success", data: newReview });
});

exports.getReviews = asyncHandler(async (req, res, next) => {
  let filter = {};
  if (req.params.productId) filter = { product: req.params.productId };

  const reviews = await Review.find(filter).populate({
    path: "user",
    select: "name",
  });
  res.status(200).json({ results: reviews.length, data: reviews });
});

// @desc    Get specific review by id
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const review = await Review.findById(id).populate({
    path: "user",
    select: "name",
  });

  if (!review) {
    return next(new ApiError(`No review found for this id ${id}`, 444));
  }
  res.status(200).json({ data: review });
});

// @desc    Update specific review
// @route   PUT /api/v1/reviews/:id
// @access  Private/Protect/User
exports.updateReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const review = await Review.findByIdAndUpdate(id, req.body, { new: true });

  if (!review) {
    return next(new ApiError(`No review found for this id ${id}`, 404));
  }
  res.status(200).json({ data: review });
});

// @desc    Delete specific review
// @route   DELETE /api/v1/reviews/:id
// @access  Private/Protect/User-Admin-Manager
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const review = await Review.findByIdAndDelete(id);

  if (!review) {
    return next(new ApiError(`No review found for this id ${id}`, 404));
  }
  res.status(204).send();
});

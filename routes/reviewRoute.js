const express = require("express");
const {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

// استيراد دالة التوثيق باسم auth مباشرة
const { auth } = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

// مسار جلب كل التقييمات أو إضافة تقييم
router.route("/").get(getReviews).post(auth, createReview);

// مسار التعامل مع تقييم معين باستخدام الـ ID
router
  .route("/:id")
  .get(getReview)
  .put(auth, updateReview)
  .delete(auth, deleteReview);

module.exports = router;

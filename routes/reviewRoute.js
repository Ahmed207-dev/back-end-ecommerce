const express = require("express");
const {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const { auth } = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router.route("/").get(getReviews).post(auth, createReview);

router
  .route("/:id")
  .get(getReview)
  .put(auth, updateReview)
  .delete(auth, deleteReview);

module.exports = router;

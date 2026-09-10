const express = require("express");
const {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishlist,
} = require("../controllers/wishlistController");

// استيراد authController  بالمسار الصحيح
const authService = require("../controllers/authController");

const router = express.Router();

// استخدام auth بدلاً من protect لأنها المكتوبة في authController عندك
router.use(authService.auth, authService.allowedTo("user"));

router.route("/").post(addProductToWishlist).get(getLoggedUserWishlist);

router.delete("/:productId", removeProductFromWishlist);

module.exports = router;

const express = require("express");
const {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishlist,
} = require("../controllers/wishlistController");

const authService = require("../controllers/authController");

const router = express.Router();

router.use(authService.auth, authService.allowedTo("user"));

router.route("/").post(addProductToWishlist).get(getLoggedUserWishlist);

router.delete("/:productId", removeProductFromWishlist);

module.exports = router;

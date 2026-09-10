const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// @desc    إضافة منتج للمفضلة (Add product to wishlist)
// @route   POST /api/v1/wishlist
// @access  Protected/User
exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  // $addToSet بتضيف المنتج لـ wishlist بشرط عدم تكراره
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Product added successfully to your wishlist",
    data: user.wishlist,
  });
});

// @desc    إزالة منتج من المفضلة (Remove product from wishlist)
// @route   DELETE /api/v1/wishlist/:productId
// @access  Protected/User
exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
  // $pull بتشيل المنتج المحدد من الـ Array
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Product removed successfully from your wishlist",
    data: user.wishlist,
  });
});

// @desc    جلب قائمه المفضلة للمستخدم (Get logged user wishlist)
// @route   GET /api/v1/wishlist
// @access  Protected/User
exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishlist");

  res.status(200).json({
    status: "success",
    results: user.wishlist ? user.wishlist.length : 0,
    data: user.wishlist || [],
  });
});

const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");
const ApiError = require("../utils/apiError"); // 👈 تمت إضافة الاستدعاء هنا

// @desc    Add address to user addresses list
// @route   POST /api/v1/addresses
// @access  Protected/User
exports.addAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Address added successfully",
    data: user.addresses,
  });
});

// @desc    Remove address from user addresses list
// @route   DELETE /api/v1/addresses/:addressId
// @access  Protected/User
exports.removeAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Address removed successfully",
    data: user.addresses,
  });
});

// @desc    Get logged user addresses
// @route   GET /api/v1/addresses
// @access  Protected/User
exports.getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    status: "success",
    results: user.addresses.length,
    data: user.addresses,
  });
});

// @desc    Get specific address
// @route   GET /api/v1/addresses/:addressId
// @access  Protected/User
exports.getSpecificAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const address = user.addresses.id(req.params.addressId);

  if (!address) {
    return next(
      new ApiError(
        `No address found with this id: ${req.params.addressId}`,
        404
      )
    );
  }

  res.status(200).json({ status: "success", data: address });
});

// @desc    Update specific address
// @route   PUT /api/v1/addresses/:addressId
// @access  Protected/User
exports.updateAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const address = user.addresses.id(req.params.addressId);

  if (!address) {
    return next(
      new ApiError(
        `No address found with this id: ${req.params.addressId}`,
        404
      )
    );
  }

  address.alias = req.body.alias || address.alias;
  address.details = req.body.details || address.details;
  address.phone = req.body.phone || address.phone;
  address.city = req.body.city || address.city;
  address.postalCode = req.body.postalCode || address.postalCode;

  await user.save();

  res.status(200).json({ status: "success", data: user.addresses });
});

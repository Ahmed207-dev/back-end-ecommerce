const Coupon = require("../models/couponModel");

// @desc    Get list of coupons
// @route   GET /api/v1/coupons
exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res
      .status(200)
      .json({ status: "success", results: coupons.length, data: coupons });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// @desc    Get single coupon by id
// @route   GET /api/v1/coupons/:id
exports.getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res
        .status(404)
        .json({ status: "fail", message: "No coupon found with this ID" });
    }
    res.status(200).json({ status: "success", data: coupon });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// @desc    Create a coupon
// @route   POST /api/v1/coupons
exports.createCoupon = async (req, res) => {
  try {
    const newCoupon = await Coupon.create(req.body);
    res.status(201).json({ status: "success", data: newCoupon });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// @desc    Update a coupon
// @route   PUT /api/v1/coupons/:id
exports.updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!coupon) {
      return res
        .status(404)
        .json({ status: "fail", message: "No coupon found with this ID" });
    }
    res.status(200).json({ status: "success", data: coupon });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// @desc    Delete a coupon
// @route   DELETE /api/v1/coupons/:id
exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res
        .status(404)
        .json({ status: "fail", message: "No coupon found with this ID" });
    }
    res.status(204).json({ status: "success", data: null });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

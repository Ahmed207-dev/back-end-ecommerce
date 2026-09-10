const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Coupon name is required"],
      unique: true,
      uppercase: true,
    },
    expire: {
      type: Date,
      required: [true, "Coupon expiration date is required"],
    },
    discount: {
      type: Number,
      required: [true, "Coupon discount value is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);

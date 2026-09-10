const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const ApiError = require("../utils/apiError");
const factory = require("./handlersFactory");
const User = require("../models/userModel");

const createToken = (payload) =>
  jwt.sign({ id: payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// ==========================================
// 1. Logged User Controllers
// ==========================================

// @desc    Get Logged user data
// @route   GET /api/v1/users/getMe
// @access  Protected/User
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc    Update Logged user password
// @route   PUT /api/v1/users/changeMyPassword
// @access  Protected/User
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const isCorrectPassword = await bcrypt.compare(
    req.body.currentPassword,
    user.password
  );
  if (!isCorrectPassword) {
    return next(new ApiError("Current password is incorrect", 400));
  }

  user.password = req.body.password;
  user.passwordChangedAt = Date.now();
  await user.save();

  const token = createToken(user._id);

  res.status(200).json({
    status: "success",
    token,
    data: user,
  });
});

// @desc    Update Logged user data (name, email, phone)
// @route   PUT /api/v1/users/updateMe
// @access  Protected/User
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({ status: "success", data: updatedUser });
});

// @desc    Delete Logged user data (Deactivate)
// @route   DELETE /api/v1/users/deleteMe
// @access  Protected/User
exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({ status: "success", data: null });
});

// ==========================================
// 2. Admin Controllers
// ==========================================

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
exports.getUsers = factory.getAll(User);

// @desc    Get specific user by id
// @route   GET /api/v1/users/:id
// @access  Private/Admin
exports.getUser = factory.getOne(User);

// @desc    Create user
// @route   POST /api/v1/users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    slug: req.body.slug,
    email: req.body.email,
    phone: req.body.phone,
    profileImg: req.body.profileImg,
    password: req.body.password,
  });

  res.status(201).json({ data: user });
});

// @desc    Update user data without password
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
    },
    { new: true }
  );

  if (!document) {
    return next(
      new ApiError(`No document found for this id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ data: document });
});

// @desc    Update user password by Admin
// @route   PUT /api/v1/users/changePassword/:id
// @access  Private/Admin
exports.updateUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );

  if (!document) {
    return next(
      new ApiError(`No document found for this id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ data: document });
});

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
exports.deleteUser = factory.deleteOne(User);

const sharp = require("sharp"); // image processing lib for nodejs
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");

const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/imageUpload");
const Category = require("../models/categoryModel");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

exports.uploadCategoryImage = uploadSingleImage("image");

// Resize image
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  const buffer = await sharp(req.file.buffer)
    .resize(500, 500)
    .jpeg({ quality: 90 })
    .toBuffer();

  const result = await uploadToCloudinary(buffer, {
    folder: "categories",
    public_id: `category-${uuidv4()}-${Date.now()}`,
  });

  req.body.image = result.secure_url;

  // Keep this if you need to delete/replace the image later
  req.file.cloudinary = {
    url: result.secure_url,
    publicId: result.public_id,
  };

  next();
});

// @desc      Get all categories
// @route     GET /api/v1/categories
// @access    Public
exports.getCategories = factory.getAll(Category);

// @desc      Get specific category by id
// @route     GET /api/v1/categories/:id
// @access    Public
exports.getCategory = factory.getOne(Category);

// @desc      Create category
// @route     POST /api/v1/categories
// @access    Private
exports.createCategory = factory.createOne(Category);

// @desc      Update category
// @route     PATCH /api/v1/categories/:id
// @access    Private
exports.updateCategory = factory.updateOne(Category);

// @desc     Delete category
// @route    DELETE /api/v1/categories/:id
// @access   Private
exports.deleteCategory = factory.deleteOne(Category);

exports.deleteAll = factory.deleteAll(Category);

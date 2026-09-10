const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");

const multer = require("multer");

const ApiError = require("../utils/apiError");
const Product = require("../models/productModel");
const factory = require("./handlersFactory");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

// Storage
const multerStorage = multer.memoryStorage();

// Accept only images
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("only images allowed", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadProductImages = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  // 1. Process imageCover
  if (req && req.files && req.files.imageCover && req.files.imageCover.length) {
    const imageCover = req.files.imageCover[0];

    const buffer = await sharp(imageCover.buffer)
      // .resize(2000, 1333)
      .jpeg({ quality: 90 })
      .toBuffer();

    const result = await uploadToCloudinary(buffer, {
      folder: "products",

      public_id: `product-${uuidv4()}-${Date.now()}-cover`,
    });

    req.body.imageCover = result.secure_url;
    req.body.imageCoverPublicId = result.public_id;
  }

  // 2. Process product images
  req.body.images = [];
  req.body.imagePublicIds = [];

  if (req && req.files && req.files.images && req.files.images.length) {
    const uploadedImages = await Promise.all(
      req.files.images.map(async (img, index) => {
        const buffer = await sharp(img.buffer)
          // .resize(800, 800)
          .jpeg({ quality: 90 })
          .toBuffer();

        const result = await uploadToCloudinary(buffer, {
          folder: "products",
          public_id: `product-${uuidv4()}-${Date.now()}-${index + 1}`,
        });

        return {
          url: result.secure_url,
          publicId: result.public_id,
        };
      })
    );

    req.body.images = uploadedImages.map((image) => image.url);
    req.body.imagePublicIds = uploadedImages.map((image) => image.publicId);
  }

  next();
});

// @desc      Get all products
// @route     GET /api/v1/products
// @access    Public
exports.getProducts = factory.getAll(Product, "Products");

// @desc      Get specific product by id
// @route     GET /api/v1/products/:id
// @access    Public
exports.getProduct = factory.getOne(Product);

// @desc      Create product
// @route     POST /api/v1/products
// @access    Private
exports.createProduct = factory.createOne(Product);
// @desc      Update product
// @route     PATCH /api/v1/products/:id
// @access    Private
exports.updateProduct = factory.updateOne(Product);

// @desc     Delete product
// @route    DELETE /api/v1/products/:id
// @access   Private
exports.deleteProduct = factory.deleteOne(Product);

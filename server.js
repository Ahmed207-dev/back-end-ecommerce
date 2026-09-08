const path = require("path");
const express = require("express");
const dotenv = require("dotenv");

dotenv.config({ path: "config.env" });
const morgan = require("morgan");
require("colors");
const compression = require("compression");
const cors = require("cors");

const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");

const dbConnection = require("./config/database");

const categoryRouter = require("./routes/categoryRoute");
const subCategoryRouter = require("./routes/subCategoryRoute");
const brandRouter = require("./routes/brandRoute");
const productRouter = require("./routes/productRoute");
const userRouter = require("./routes/userRoute");
const authRouter = require("./routes/authRoute");
const reviewRouter = require("./routes/reviewRoute"); // 1. استيراد مسار التقييمات
const wishlistRoute = require("./routes/wishlistRoute"); // أو اسم الملف لديك
const addressRouter = require("./routes/addressRoute");
const cartRouter = require("./routes/cartRoute");
const orderRoute = require("./routes/orderRoute");
// DB Connection
dbConnection();

// Builtin Middleware
const app = express();

//

const couponRouter = require("./routes/couponRoute");

app.use(express.json());

// Mounting Routes

//
// Used to parse JSON bodies
app.use(express.json());

app.use(compression());
app.use(cors());
app.options("*", cors());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`Mode : ${process.env.NODE_ENV}`.yellow);
}

// Mount routers
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/subcategories", subCategoryRouter);
app.use("/api/v1/brands", brandRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/wishlist", wishlistRoute);
app.use("/api/v1/coupons", couponRouter);
app.use("/api/v1/addresses", addressRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRoute);
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handler
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.green);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    console.log("unhandledRejection!! shutting down...");
    process.exit(1);
  });
});

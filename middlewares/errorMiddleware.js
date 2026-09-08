const AppError = require("../utils/apiError");

const sendErrorForDev = (err, req, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorForProduction = (err, req, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Programming or other unknown error: don't leak error details
  console.error("ERROR 💥", err);
  return res.status(500).json({
    status: "error",
    message: "Something went very wrong!",
  });
};

// معالجة خطأ القيم المكررة في الداتابيز بشكل آمن بدون كراش
const handleDuplicateFieldsDB = (err) => {
  // استخراج النص المكرر من errmsg أو keyValue
  let value = "";

  if (err.keyValue) {
    value = Object.values(err.keyValue)[0];
  } else if (err.errmsg) {
    const match = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
    value = match ? match[0] : "";
  }

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Invalid Token. please login again", 401);

const handleExpiredJWT = () =>
  new AppError("Expired Token. please login again", 401);

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    // في حالة التطوير، سنفحص أخطاء MongoDB أيضاً لتظهر لك الرسالة الواضحة فوراً
    let error = { ...err };
    error.message = err.message;

    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleExpiredJWT();

    sendErrorForDev(error, req, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleExpiredJWT();

    sendErrorForProduction(error, req, res);
  }
};

module.exports = globalError;

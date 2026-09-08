const express = require("express");

const { auth, allowedTo } = require("../controllers/authController");
const {
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData,
  getUsers,
  createUser,
  getUser,
  updateUser,
  updateUserPassword,
  deleteUser,
} = require("../controllers/userController");

// استدعِ الـ Validators اللي موجودة فعلياً في مشروعك بس
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
} = require("../utils/validators/userValidator");

const router = express.Router();

// 1. حماية المسارات (login required)
router.use(auth);

// 2. مسارات المستخدم المسجل (Logged User)
router.get("/getMe", getLoggedUserData, getUser);
router.put("/changeMyPassword", updateLoggedUserPassword);
router.put("/updateMe", updateLoggedUserData);
router.delete("/deleteMe", deleteLoggedUserData);

// 3. مسارات الأدمن (Admin / Manager)
router.use(allowedTo("admin", "manager"));

router.put("/changePassword/:id", updateUserPassword);

router.route("/").get(getUsers).post(createUserValidator, createUser);

router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;

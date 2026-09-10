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

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
} = require("../utils/validators/userValidator");

const router = express.Router();

router.use(auth);

router.get("/getMe", getLoggedUserData, getUser);
router.put("/changeMyPassword", updateLoggedUserPassword);
router.put("/updateMe", updateLoggedUserData);
router.delete("/deleteMe", deleteLoggedUserData);

router.use(allowedTo("admin", "manager"));

router.put("/changePassword/:id", updateUserPassword);

router.route("/").get(getUsers).post(createUserValidator, createUser);

router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;

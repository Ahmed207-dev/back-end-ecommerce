const express = require("express");

const { auth, allowedTo } = require("../controllers/authController");

const {
  addAddress,
  removeAddress,
  getLoggedUserAddresses,
  getSpecificAddress,
  updateAddress,
} = require("../controllers/addressController");

const router = express.Router();

router.use(auth, allowedTo("user", "admin", "manager"));

router.route("/").post(addAddress).get(getLoggedUserAddresses);

router
  .route("/:addressId")
  .get(getSpecificAddress)
  .put(updateAddress)
  .delete(removeAddress);

module.exports = router;

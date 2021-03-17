const express = require("express");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const passport = require("passport");
const router = express.Router();
const {
  renderRegistrationForm,
  registerUser,
  renderLoginForm,
  loginUser,
  logoutUser,
} = require("../controllers/userControllers");
const { passport_authenticate } = require("../middleware");

router.route("/register").get(renderRegistrationForm).post(registerUser);
router
  .route("/login")
  .get(renderLoginForm)
  .post(passport_authenticate, loginUser);

router.get("/logout", logoutUser);

module.exports = router;

const express = require("express");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const passport = require("passport");
const router = express.Router();

router.get("/register", (req, res, next) => {
  res.render("user/register");
});

router.post(
  "/register",
  catchAsync(async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.flash("success", "Registration completed!");
      res.redirect("/campgrounds");
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  })
);

router.get("/login", (req, res, next) => {
  res.render("user/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res, next) => {
    req.flash("success", "Welcome back");
    res.redirect("/campgrounds");
  }
);

router.post(
  "/logout",
  catchAsync(async (req, res, next) => {})
);

module.exports = router;

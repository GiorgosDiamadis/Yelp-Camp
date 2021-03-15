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
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Registration completed!");
        res.redirect("/campgrounds");
      });
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
    const redirectUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

router.get("/logout", (req, res, next) => {
  req.logout();
  req.flash("success", "Logged out!");
  res.redirect("/campgrounds");
});

module.exports = router;

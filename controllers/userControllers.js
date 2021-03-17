const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const flash = require("connect-flash");

module.exports.renderRegistrationForm = (req, res, next) => {
  res.render("user/register");
};

module.exports.registerUser = catchAsync(async (req, res, next) => {
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
});

module.exports.renderLoginForm = (req, res, next) => {
  res.render("user/login");
};

module.exports.loginUser = (req, res, next) => {
  req.flash("success", "Welcome back");
  const redirectUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;

  res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res, next) => {
  req.logout();
  req.flash("success", "Logged out!");
  res.redirect("/campgrounds");
};

const {
  campgroundValidation,
  reviewValidation,
} = require("./models/validationSchemas");
const Campground = require("./models/campground");
const Review = require("./models/reviews");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");

module.exports.is_Authenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first");
    return res.redirect("/login");
  }
  next();
};
module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundValidation.validate(req.body);
  if (error) {
    req.flash("error", error.message);
    const { id } = req.params.id;
    if (id === undefined) return res.redirect("/campgrounds");
    else return res.redirect(`/campgrounds/${req.params.id}`);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewValidation.validate(req.body, { abortEarly: false });
  if (error) {
    req.flash("error", error.message);
    return res.redirect(`/campgrounds/${req.params.id}`);
  } else {
    next();
  }
};

module.exports.has_campground_permission = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(req.params.id);

    if (
      campground.user === undefined ||
      campground.user.toString() != req.user._id.toString()
    ) {
      req.flash("error", "You don't have permission on this campground");
      return res.redirect(`/campgrounds/${id}`);
    }
    next();
  }
);

module.exports.has_review_permission = catchAsync(async (req, res, next) => {
  const { id, reviewId } = req.params;

  const review = await Review.findById(reviewId);

  console.log(review + " " + review.user + " " + req.user);
  if (
    review.user === undefined ||
    review.user.toString() != req.user._id.toString()
  ) {
    req.flash("error", "You don't have permission on this review");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
});

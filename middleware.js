const {
  campgroundValidation,
  reviewValidation,
} = require("./models/validationSchemas");
const Campground = require("./models/campground");
const Review = require("./models/reviews");
const catchAsync = require("./utils/catchAsync");

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
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewValidation.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
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

const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/reviews");
const flash = require("connect-flash");

module.exports.createReview = catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.rev);
  review.user = req.user;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "Review added successfully");

  res.redirect(`/campgrounds/${campground._id}`);
});

module.exports.deleteReview = catchAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted");

  res.redirect(`/campgrounds/${id}`);
});

const express = require("express");
const router = express.Router({ mergeParams: true });
const flash = require("connect-flash");
const Campground = require("../models/campground");
const Review = require("../models/reviews");
const { is_Authenticated, has_review_permission } = require("../middleware");
const { validateReview } = require("../middleware");

const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

router.post(
  "/",
  is_Authenticated,
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.rev);
    review.user = req.user;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Review added successfully");

    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:reviewId",
  is_Authenticated,
  has_review_permission,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted");

    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;

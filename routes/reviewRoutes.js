const express = require("express");
const router = express.Router({ mergeParams: true });
const flash = require("connect-flash");
const Campground = require("../models/campground");
const Review = require("../models/reviews");
const { is_Authenticated, has_review_permission } = require("../middleware");
const { validateReview } = require("../middleware");
const {
  createReview,
  deleteReview,
} = require("../controllers/reviewControllers");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

router.post("/", is_Authenticated, validateReview, createReview);

router.delete(
  "/:reviewId",
  is_Authenticated,
  has_review_permission,
  deleteReview
);

module.exports = router;

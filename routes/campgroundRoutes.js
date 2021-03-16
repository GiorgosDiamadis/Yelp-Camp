const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const {
  validateCampground,
  has_campground_permission,
} = require("../middleware");
const flash = require("connect-flash");
const { chunkify } = require("../public/js/utils");

const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { is_Authenticated, has_permission } = require("../middleware");

router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    out = chunkify(campgrounds, 4);
    res.render("campgrounds/index", { campgrounds, out });
  })
);

router.get("/new", is_Authenticated, (req, res) => {
  res.render("campgrounds/new");
});

router.post(
  "/",
  is_Authenticated,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    if (campground === null) {
      req.flash("error", "Something went wrong, can't create campground!");
      return res.redirect("/campgrounds");
    } else {
      campground.user = req.user;
      await campground.save();
      req.flash("success", "Successfully added a new campground");
      res.redirect(`/campgrounds/${campground._id}`);
    }
  })
);

router.get(
  "/:id",
  is_Authenticated,
  catchAsync(async (req, res) => {
    try {
      const campground = await Campground.findById(req.params.id).populate(
        "reviews"
      );

      res.render("campgrounds/show", { campground });
    } catch (error) {
      req.flash("error", "Campground doesn't exist");

      return res.redirect("/campgrounds");
    }
  })
);

router.get(
  "/:id/edit",
  is_Authenticated,
  has_campground_permission,
  catchAsync(async (req, res) => {
    try {
      const campground = await Campground.findById(req.params.id);
      res.render("campgrounds/edit", { campground });
    } catch (error) {
      req.flash("error", "Campground doesn't exist");

      return res.redirect("/campgrounds");
    }
  })
);

router.put(
  "/:id",
  is_Authenticated,
  has_campground_permission,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", "Campground edited successfully");

    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:id",
  is_Authenticated,
  has_campground_permission,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Campground deleted");

    res.redirect("/campgrounds");
  })
);

module.exports = router;

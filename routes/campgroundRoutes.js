const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { campgroundSchema } = require("../validation");
const flash = require("connect-flash");
const { chunkify } = require("../public/js/utils");

const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    out = chunkify(campgrounds, 4);
    res.render("campgrounds/index", { campgrounds, out });
  })
);

router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});

router.post(
  "/",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    if (campground === null) {
      req.flash("error", "Something went wrong, can't create campground!");
      return res.redirect("/campgrounds");
    } else {
      await campground.save();
      req.flash("success", "Successfully added a new campground");
      res.redirect(`/campgrounds/${campground._id}`);
    }
  })
);

router.get(
  "/:id",
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
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Campground deleted");

    res.redirect("/campgrounds");
  })
);

module.exports = router;

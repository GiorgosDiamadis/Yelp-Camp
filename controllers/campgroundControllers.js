const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const { chunkify } = require("../public/js/utils");
const flash = require("connect-flash");

module.exports.index = catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({});
  out = chunkify(campgrounds, 4);
  res.render("campgrounds/index", { campgrounds, out });
});

module.exports.renderNewCampgroundForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createNewCampground = catchAsync(async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  if (campground === null) {
    req.flash("error", "Something went wrong, can't create campground!");
    return res.redirect("/campgrounds");
  } else {
    campground.user = req.user;
    try {
      await campground.save();
      req.flash("success", "Successfully added a new campground");
      res.redirect(`/campgrounds/${campground._id}`);
    } catch (e) {
      if (e.code === 11000) {
        req.flash("error", "There is already a campground with that name!");
      }

      res.redirect(`/campgrounds/new`);
    }
  }
});

module.exports.viewCampground = catchAsync(async (req, res) => {
  try {
    const campground = await Campground.findById(req.params.id)
      .populate({
        path: "reviews",
        populate: {
          path: "user",
        },
      })
      .populate("user");
    res.render("campgrounds/show", { campground });
  } catch (error) {
    req.flash("error", "Campground doesn't exist");

    return res.redirect("/campgrounds");
  }
});

module.exports.renderEditCampgroundForm = catchAsync(async (req, res) => {
  try {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  } catch (error) {
    req.flash("error", "Campground doesn't exist");

    return res.redirect("/campgrounds");
  }
});

module.exports.editCampground = catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  req.flash("success", "Campground edited successfully");

  res.redirect(`/campgrounds/${campground._id}`);
});

module.exports.deleteCampground = catchAsync(async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Campground deleted");

  res.redirect("/campgrounds");
});

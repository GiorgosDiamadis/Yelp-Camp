const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");

const {
  validateCampground,
  has_campground_permission,
} = require("../middleware");

const flash = require("connect-flash");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { is_Authenticated, has_permission } = require("../middleware");

const {
  index,
  renderNewCampgroundForm,
  createNewCampground,
  viewCampground,
  renderEditCampgroundForm,
  editCampground,
  deleteCampground,
} = require("../controllers/campgroundControllers");

router.get("/", index);

router.get("/new", is_Authenticated, renderNewCampgroundForm);

router.post("/", is_Authenticated, validateCampground, createNewCampground);

router.get("/:id", is_Authenticated, viewCampground);

router.get(
  "/:id/edit",
  is_Authenticated,
  has_campground_permission,
  renderEditCampgroundForm
);

router.put(
  "/:id",
  is_Authenticated,
  has_campground_permission,
  validateCampground,
  editCampground
);

router.delete(
  "/:id",
  is_Authenticated,
  has_campground_permission,
  deleteCampground
);

module.exports = router;

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

router
  .route("/")
  .get(index)
  .post(is_Authenticated, validateCampground, createNewCampground);

router.get("/new", is_Authenticated, renderNewCampgroundForm);

router
  .route("/:id")
  .get(viewCampground)
  .put(
    is_Authenticated,
    has_campground_permission,
    validateCampground,
    editCampground
  )
  .delete(is_Authenticated, has_campground_permission, deleteCampground);

router.get(
  "/:id/edit",
  is_Authenticated,
  has_campground_permission,
  renderEditCampgroundForm
);

module.exports = router;

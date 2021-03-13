const express = require("express");
const catchAsync = require("../utils/catchAsync");
const router = express.Router();

router.get(
  "/register",
  catchAsync((req, res, next) => {
    res.render("user/register");
  })
);

module.exports = router;

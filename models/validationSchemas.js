const Joi = require("joi");

module.exports.campgroundValidation = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),
    image: Joi.string().required(),
    price: Joi.number().required().min(0).label("Price"),
    description: Joi.string().required(),
    location: Joi.string().required(),
  }).required(),
});

module.exports.reviewValidation = Joi.object({
  rev: Joi.object({
    review: Joi.string().required(),
    rating: Joi.number().min(0).max(5).required().label("Rating"),
  }).required(),
});

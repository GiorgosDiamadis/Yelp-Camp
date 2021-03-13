const mongoose = require("mongoose");
const passportMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
});

userSchema.plugin(passportMongoose);

module.exports = mongoose.model("User", userSchema);

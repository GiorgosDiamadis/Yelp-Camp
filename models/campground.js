const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews");

const CampgroundSchema = new Schema({
  title: { type: String, unique: true },
  image: String,
  price: Number,
  description: String,
  location: String,
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);

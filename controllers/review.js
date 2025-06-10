const Listing = require("../models/listing");
const review = require("../models/review.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/expressError"); // Make sure you have this error handler or replace accordingly

module.exports.createReview = async (req, res) => {
  let { id } = req.params; // access listing id
  const listing = await Listing.findById(id);
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }
  const newReview = new Review(req.body.review);

  // Add the author field
  newReview.author = req.user._id;

  // Save the review first
  await newReview.save();

  // Use findByIdAndUpdate instead of save() to avoid validation
  await Listing.findByIdAndUpdate(id, { $push: { reviews: newReview._id } });

  req.flash("success", "New Review Created!");
  console.log(`New review added to listing ${id}`);
  res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params; // listing id and review id
  const listing = await Listing.findById(id);
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }

  // Remove review from listing's reviews array
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  // Delete review document
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review Deleted!");
  console.log(`Deleted review ${reviewId} from listing ${id}`);
  res.redirect(`/listings/${id}`);
};
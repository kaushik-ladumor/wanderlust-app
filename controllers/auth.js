
const User = require("../models/user.js");
const Listing = require('../models/listing');
const Review = require('../models/review');

// DELETE USER AND RELATED DATA

const deleteUserAndRelatedData = async (req, res) => {
  const userId = req.params.id;

  try {
    // Delete reviews authored by user
    await Review.deleteMany({ author: userId });

    // Find listings created by user
    const listings = await Listing.find({ owner: userId });
    const listingIds = listings.map(listing => listing._id);

    // Delete reviews ON those listings
    await Review.deleteMany({ listing: { $in: listingIds } });

    // Delete listings
    await Listing.deleteMany({ owner: userId });

    // Delete user
    await User.findByIdAndDelete(userId);

    req.flash("success", "User and all related data deleted.");
    res.redirect('/admin');
  } catch (error) {
    console.error("Error deleting user and data:", error);
    req.flash("error", "Failed to delete user.");
    res.redirect('/admin');
  }
};

module.exports = {
  deleteUserAndRelatedData
};

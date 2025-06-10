const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/expressError");
const { listingSchema } = require("../schema");
const listingController = require("../controllers/listing");
const multer  = require('multer');
const { storage } = require('../cloudConfing');
const upload = multer({ storage });
const { isLoggedIn, isListingAuthor } = require("../middleware/auth");

// JOI Validation Middleware
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, msg);
  }
  next();
};

// Index & Create Listing
router
  .route("/")
  .get(wrapAsync(listingController.index))
  // Fix the image field name
  .post(isLoggedIn, validateListing, upload.single('listing[image]'), wrapAsync(listingController.createListing));


// New Listing Form
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show, Update, Delete Listing
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  // Fix the image field name
  .put(isLoggedIn, isListingAuthor, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isListingAuthor, wrapAsync(listingController.deleteListing));

// Edit Listing Form
router.get("/:id/edit", isLoggedIn, isListingAuthor, wrapAsync(listingController.renderEditForm));

module.exports = router;

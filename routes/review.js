const express = require('express');
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/expressError");
const { reviewSchema } = require("../schema");
const { isLoggedIn, isReviewAuthor } = require("../middleware/auth");

const reviewController = require('../controllers/review');

// JOI Validation Middleware
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(400, msg);
  }
  next();
};

// === CREATE Review ===
router.post('/', isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// === DELETE Review ===
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;

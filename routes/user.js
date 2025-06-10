// === routes/user.js ===
const express = require("express");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware/auth.js");
const userController = require("../controllers/user.js");

const router = express.Router();

// Render Signup Form
router.get("/signup", userController.renderSignupForm);

// Signup POST
router.post("/signup", wrapAsync(userController.signup));

// Render Login Form
router.get("/login", userController.renderLoginForm);

// Login POST
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);

// Email Verification
router.post("/verify", wrapAsync(userController.verifyEmail));

// Logout
router.post("/logout", userController.logout);

module.exports = router;

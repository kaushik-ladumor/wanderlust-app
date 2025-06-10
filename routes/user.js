// === routes/user.js ===
const express = require("express");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware/auth.js");
const userController = require("../controllers/user.js");

const route = express.Router();

// Render Signup Form
route.get("/signup", userController.renderSignupForm);

// Signup POST
route.post("/signup", wrapAsync(userController.signup));

// Render Login Form
route.get("/login", userController.renderLoginForm);

// Login POST
route.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);

// Email Verification
route.post("/verify", wrapAsync(userController.verifyEmail));

// Logout
route.post("/logout", userController.logout);

module.exports = route;

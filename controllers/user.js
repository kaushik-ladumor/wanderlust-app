
const User = require("../models/user.js");
const { sendVerificationCode, sendWelcomeEmail } = require("../middleware/email.js");



exports.renderSignupForm = (req, res) => {
  res.render("user/signup.ejs");
};

exports.signup = async (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !password || !name) {
    req.flash("error", "All fields are required");
    return res.redirect("/signup");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    req.flash("error", "User already exists. Please login.");
    return res.redirect("/login");
  }

  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  const newUser = new User({ email, name, verificationCode });
  const registerUser = await User.register(newUser, password);

  sendVerificationCode(newUser.email, verificationCode);
  res.render("user/verify.ejs", { email: newUser.email });
};

exports.renderLoginForm = (req, res) => {
  res.render("user/login.ejs");
};

exports.login = async (req, res, next) => {
  // Check if user is verified after login (Passport already authenticated the user)
  if (!req.user.isVerified) {
    req.logout((err) => {
      if (err) return next(err);
      req.flash("error", "Please verify your email before logging in.");
      res.redirect("/signup"); // Or redirect to verify page
    });
    return;
  }

  req.flash("success", "Welcome back!");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  delete req.session.redirectUrl;
  res.redirect(redirectUrl);
};


exports.verifyEmail = async (req, res, next) => {
  const { code, email } = req.body;
  const user = await User.findOne({ email, verificationCode: code });

  if (!user) {
    req.flash("error", "Invalid or expired verification code.");
    return res.redirect("/signup");
  }

  user.isVerified = true;
  user.verificationCode = undefined;
  await user.save();

  sendWelcomeEmail(user.email, user.name);

  req.login(user, (err) => {
    if (err) return next(err);
    req.flash("success", "Email verified successfully! You are now logged in.");
    res.redirect("/listings");
  });
};

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You are logged out now!");
    res.redirect("/listings");
  });
};

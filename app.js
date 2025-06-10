// app.js

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const MongoStore = require("connect-mongo");

const User = require("./models/user");

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Session store in MongoDB
const store = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI,
  crypto: { secret: process.env.SESSION_SECRET || "fallbacksecret" },
  touchAfter: 24 * 3600
});
store.on("error", err => console.log("Mongo Session Store Error:", err));

// Session setup
app.use(session({
  store,
  secret: process.env.SESSION_SECRET || "fallbacksecret",
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }
}));
app.use(flash());

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({ usernameField: "email" }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Parse form and JSON data, override HTTP methods
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

// View engine setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Global variables for templates
app.use((req, res, next) => {
  res.locals.currUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.adminEmail = process.env.ADMIN_EMAIL;
  next();
});

// Redirect root "/" to "/listings"
app.get("/", (req, res) => {
  res.redirect("/listings");  // Redirect so root is handled by your listings route
});

// Route imports
const userRoutes = require("./routes/user");
const listingRoutes = require("./routes/listing");
const reviewRoutes = require("./routes/review");
const adminRoutes = require("./routes/admin");

// Mount routes
app.use("/", userRoutes);
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", adminRoutes);

// Handle undefined routes (404)
app.get("*", (req, res) => {
  res.status(404).render("error", { message: "Page Not Found!" });
});

// Centralized error handling
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error", { message });
});

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});

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
const User = require("./models/user");
const MongoStore = require('connect-mongo');

// MongoDB Connection
async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("MongoDB Connected Successfully");
}
main().catch((err) => console.error("MongoDB Connection Error:", err));

const store = MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    crypto: {
        secret: process.env.SESSION_SECRET || "fallbacksecret",
    },
    touchAfter: 24 * 3600,
});

store.on('error', function(err) {
    console.log("Error in Mongo Session Store", err);
});

// Session Config
const sessionOpt = {
  store,
  secret: process.env.SESSION_SECRET || "fallbacksecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOpt));
app.use(flash());

// Passport Setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({ usernameField: "email" }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// Global Middleware
app.use((req, res, next) => {
  res.locals.currUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.adminEmail = process.env.ADMIN_EMAIL; 
  next();
});

// View Engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// Routes
const userRoute = require("./routes/user");
const listingRoute = require("./routes/listing");
const reviewRoute = require("./routes/review");
const adminRoute = require("./routes/admin");

app.use("/", userRoute);
app.use("/listings", listingRoute);
app.use("/listings/:id/reviews", reviewRoute);
app.use("/", adminRoute);

app.get("/", (req, res) => {
  res.redirect("/listings");  // Redirect so root is handled by your listings route
});


// Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error", { message });
});

// Start Server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/listings`);
});
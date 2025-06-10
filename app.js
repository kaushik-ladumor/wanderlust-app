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

// Database Connection
const dbUrl = process.env.MONGODB_URI || "mongodb://localhost:27017/yourdb";
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1); // Exit if DB connection fails
  });

// Session Configuration
const sessionConfig = {
  store: MongoStore.create({
    mongoUrl: dbUrl,
    crypto: { secret: process.env.SESSION_SECRET || "fallbacksecret" },
    touchAfter: 24 * 3600
  }),
  name: 'session',
  secret: process.env.SESSION_SECRET || "fallbacksecret",
  resave: false,
  saveUninitialized: false,
  cookie: { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000 
  }
};

app.use(session(sessionConfig));
app.use(flash());

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({ usernameField: "email" }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// View Engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Global Variables
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.adminEmail = process.env.ADMIN_EMAIL;
  next();
});

// Route Imports
const userRoutes = require("./routes/user");
const listingRoutes = require("./routes/listing");
const reviewRoutes = require("./routes/review");
const adminRoutes = require("./routes/admin");

// Routes
app.get("/", (req, res) => res.redirect("/listings"));

// Mount Routes with better organization
app.use("/admin", adminRoutes);  // All admin routes under /admin
app.use("/", userRoutes);        // User auth routes
app.use("/listings", listingRoutes); // Listing routes
app.use("/listings/:id/reviews", reviewRoutes); // Review routes

// Error Handling
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  if (!res.headersSent) {
    res.status(statusCode).render("error", { message });
  }
});

// Server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
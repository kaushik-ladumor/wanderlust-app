// middleware/isVerified.js
module.exports = (req, res, next) => {
  if (!req.user || !req.user.isVerified) {
    req.flash("error", "You need to verify your email to access this page.");
    return res.redirect("/login");
  }
  next();
};

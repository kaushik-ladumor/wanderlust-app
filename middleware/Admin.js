module.exports.isAdmin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in.");
    return res.redirect("/login");
  }

  if (req.user.email !== "kaushik.ladumor04@gmail.com") {
    req.flash("error", "Access denied. Admins only.");
    return res.redirect("/listings");
  }

  next();
};

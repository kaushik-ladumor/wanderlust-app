  const Listing = require("../models/listing");
  const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
  const mapToken = process.env.MAP_TOKEN;
  const geocodingClient = mbxGeocoding({ accessToken: mapToken });

  module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("Listings/index", { allListings });
    
  };

  module.exports.renderNewForm = (req, res) => {
    res.render("Listings/new");
  };

  module.exports.createListing = async (req, res, next) => {
    let response = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();
      
    // Check if file exists
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    
    // Make sure the geometry structure matches your model
    if (response.body.features.length > 0) {
      newListing.geometry = response.body.features[0].geometry;
    }
    
    await newListing.save();

    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  };

  module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author"
      }
    })
    .populate("owner");

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    res.render("Listings/show", { listing });
  };

  module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

    res.render("Listings/edit", { listing, originalImageUrl });
  };

  module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  // Update listing fields from form
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

  // If there's a new location, re-geocode and update geometry
  if (req.body.listing.location) {
    let response = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();

    if (response.body.features.length > 0) {
      listing.geometry = response.body.features[0].geometry;
    }
  }

  // If there's a new image uploaded
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
  }

  await listing.save();

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};


  module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  };

const express = require("express");
const router = express.Router();
const Tour = require("../models/Tour");
const Booking = require("../models/Booking");

router.get("/", async (req, res) => {
  try {
    const tours = await Tour.find();
    res.render("tours", {
      tours: tours,
      admin: req.isAdmin,
      errorMessage: null,
      currentLanguage: req.session.language || "en",
      translation: res.locals.translation,
    });
  } catch (error) {
    console.error("Error fetching tour data:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const tourId = req.params.id;
    const tour = await Tour.findById(tourId);
    const error = req.query.error || null;

    if (!tour) {
      return res.status(404).send("Tour not found");
    }

    res.render("tourDetails", {
      tour,
      admin: req.isAdmin,
      errorMessage: error,
      currentLanguage: req.session.language || "en",
      translation: res.locals.translation,
    });
  } catch (error) {
    console.error("Error fetching post data:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/booking/:id", async (req, res) => {
  const tourId = req.params.id;
  const userId = req.user._id;

  try {
    const existingBooking = await Booking.findOne({
      user: userId,
      tour: tourId,
    });
    if (existingBooking) {
      return res.redirect(
        `/tours/${tourId}/?error=You%20already%20booked%20for%20this%20tour&lang=${req.query.lang}`
      );
    }

    const newBooking = new Booking({
      user: userId,
      tour: tourId,
    });

    await newBooking.save();

    res.redirect(`/booked?lang=${req.query.lang}`);
  } catch (error) {
    console.error("Error booking tour:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
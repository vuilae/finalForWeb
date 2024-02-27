const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

router.get("/", async (req, res) => {
  try {
    const userId = req.user._id;
    const bookings = await Booking.find({ user: userId }).populate("tour");
    const bookedTours = bookings.map((booking) => booking.tour);
    res.status(200).render("myBookedTours", {
      userId: userId,
      admin: req.isAdmin,
      bookedTours,
      currentLanguage: req.session.language || "en",
      translation: res.locals.translation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;

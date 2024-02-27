const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tour", 
    required: true,
  },
  enrolledAt: {
    type: Date,
    default: Date.now,
  },
});

const Booking = mongoose.model("Booking", BookingSchema);

module.exports = Booking;

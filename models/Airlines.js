const mongoose = require("mongoose");

const airlineSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  airlineData: {
    type: Object,
    required: true,
  },
  accessedAt: {
    type: Date,
    default: Date.now,
  },
});

const Airline = mongoose.model("Airline", airlineSchema);

module.exports = Airline;

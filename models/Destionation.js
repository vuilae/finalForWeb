const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dest = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  hotelData: {
    type: Object,
    required: true,
  },
  searchTerm: {
    type: String,
    required: true,
  },
  accessedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Destination", dest);

const mongoose = require("mongoose");

const tripBookingSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user: { type: mongoose.Schema.Types.ObjectId, required: true },
  departureTime: { type: Date, required: true },
  startPosition: { type: String, required: true },
  endPosition: { type: String, required: true },
});

module.exports = mongoose.model("TripBooking", tripBookingSchema);

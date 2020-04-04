const mongoose = require("mongoose");

const tripSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user: { type: mongoose.Schema.Types.ObjectId, required: true },
  time: { type: Date, required: true },
  startPosition: { type: String, required: true },
  endPosition: { type: String, required: true },
});

module.exports = mongoose.model("Trip", tripSchema);

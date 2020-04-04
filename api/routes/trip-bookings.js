const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const TripBooking = require("../models/trip-booking");
const User = require("../models/user");

router.get("/", (req, res, next) => {
  const user = req.query.user;
  const query = user !== undefined ? { user: user } : {};
  TripBooking.find(query)
    .exec()
    .then((tripBookings) => {
      res.status(200).json(tripBookings);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", (req, res, next) => {
  User.findById(req.body.user)
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          error: "User not found",
        });
      }
      const post = new TripBooking({
        _id: mongoose.Types.ObjectId(),
        user: user._id,
        departureTime: new Date(req.body.departureTime),
        startPosition: req.body.startPosition,
        endPosition: req.body.endPosition,
      });
      return post.save();
    })
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:tripBookingId", (req, res, next) => {
  TripBooking.findById(req.params.tripBookingId)
    .exec()
    .then((tripBooking) => {
      if (tripBooking) {
        return res.status(200).json(tripBooking);
      } else {
        return res.status(404).json({
          error: "Trip booking not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.delete("/:tripBookingId", (req, res, next) => {
  const id = req.params.tripBookingId;
  TripBooking.remove({ _id: id })
    .exec()
    .then((result) => {
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ error: "Trip booking not found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

module.exports = router;

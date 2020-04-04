const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const TripRequest = require("../models/trip-request");
const User = require("../models/user");

router.get("/", (req, res, next) => {
  const user = req.query.user;
  console.log(user);
  const query = user !== undefined ? { user: user } : {};
  console.log(query);
  TripRequest.find(query)
    .exec()
    .then((tripRequests) => {
      res.status(200).json(tripRequests);
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
      const post = new TripRequest({
        _id: mongoose.Types.ObjectId(),
        user: user._id,
        timeSpanStart: new Date(req.body.timeSpanStart),
        timeSpanEnd: new Date(req.body.timeSpanEnd),
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

router.get("/:tripRequestId", (req, res, next) => {
  TripRequest.findById(req.params.tripRequestId)
    .exec()
    .then((tripRequest) => {
      if (tripRequest) {
        return res.status(200).json(tripRequest);
      } else {
        return res.status(404).json({
          error: "Trip request not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.delete("/:tripRequestId", (req, res, next) => {
  const id = req.params.tripRequestId;
  TripRequest.remove({ _id: id })
    .exec()
    .then((result) => {
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ error: "Trip request not found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

module.exports = router;

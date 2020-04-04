const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Trip = require("../models/trip");
const User = require("../models/user");

router.get("/", (req, res, next) => {
  Trip.find()
    .exec()
    .then((docs) => {
      res.status(200).json(docs);
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
    .then((doc) => {
      if (!doc) {
        return res.status(404).json({
          error: "User not found",
        });
      }
      const post = new Trip({
        _id: mongoose.Types.ObjectId(),
        user: req.body.user,
        time: new Date(req.body.time),
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

router.get("/:tripId", (req, res, next) => {
  Trip.findById(req.params.postId)
    .exec()
    .then((doc) => {
      if (doc) {
        return res.status(200).json(doc);
      } else {
        return res.status(404).json({
          error: "Trip not found",
        });
      }
    });
});

router.delete("/:tripId", (req, res, next) => {
  const id = req.params.postId;
  Trip.remove({ _id: id })
    .exec()
    .then((result) => {
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ error: "No trip was found" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;

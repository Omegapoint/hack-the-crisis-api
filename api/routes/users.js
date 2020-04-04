const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = require("../models/user");

router.get("/", (req, res, next) => {
  User.find()
    .select("name username _id")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        users: docs.map(doc => {
          return {
            id: doc._id,
            username: doc.username,
            name: doc.name,
            request: {
              type: "GET",
              url: `http://localhost:3000/users/${doc._id}`
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.post("/", (req, res, next) => {
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    username: req.body.username,
    name: req.body.name,
    password: req.body.password
  });

  user
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "New user was saved",
        created: {
          id: result._id,
          username: result.username,
          name: result.name,
          request: {
            type: "GET",
            url: `http://localhost:3000/users/${result._id}`
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: err
      });
    });
});

router.get("/:userId", (req, res, next) => {
  const id = req.params.userId;

  User.findById(id)
    .exec()
    .then(doc => {
      console.log(doc);
      if (doc) {
        res.status(200).json({
          _id: doc._id,
          username: doc.username,
          name: doc.name
        });
      } else {
        res.status(404).json({ error: "No user was found" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:userId", (req, res, next) => {
  const id = req.params.userId;
  const updateOps = {};

  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  User.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.delete("/:userId", (req, res, next) => {
  const id = req.params.userId;

  User.remove({ _id: id })
    .exec()
    .then(result => {
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ error: "No user was found" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;

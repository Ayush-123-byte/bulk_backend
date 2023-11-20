const express = require("express");
const Bulk = require("../models/Bulk");
const multer = require("multer");
const router = express.Router();
const { body, validationResult } = require("express-validator");
var fetchuser = require("../middleWare/fetchuser");

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now() );
    }
  })
}).single("user_file");

router.post("/upload",upload, (req, res) => {
  res.send("file uploaded");
});

// Get all bulk
router.get("/fetchbulk", fetchuser, async (req, res) => {
  try {
    const bulk = await Bulk.find({ user: req.user.id });
    res.json(bulk);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("internal server not issue");
  }
});

// crate a bulk
router.post(
  "/createbulk",
  fetchuser,
  [
    body("number").isLength({ min: 5 }),
    body("message").isLength({ min: 5 }),
    body("contact").isLength({ min: 5 }),
    body("file").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const { number, message, contact, file } = req.body;
    try {
      //if there are error , return Bad request and the errors
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
      }
      const bulk = new Bulk({
        number,
        message,
        contact,
        file,
        user: req.user.id,
      });
      const saveBulk = await bulk.save();
      res.json(saveBulk);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("internal server error");
    }
  }
);

// update a bulk
router.put("/updatebulk/:id", fetchuser, async (req, res) => {
  const { number, message, contact, file } = req.body;
  try {
    const newBulk = {};
    if (number) {
      newBulk.number = number;
    }
    if (message) {
      newBulk.message = message;
    }
    if (contact) {
      newBulk.contact = contact;
    }
    if (file) {
      newBulk.file = file;
    }

    let bulk = await Bulk.findById(req.params.id);
    if (!bulk) {
      return res.status(404).send("Not Found");
    }
    if (bulk.user.toString() !== req.user.id) {
      return res.status(401).send("Not Found");
    }
    bulk = await Bulk.findByIdAndUpdate(
      req.params.id,
      { $set: newBulk },
      { new: true }
    );
    res.json({ bulk });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
  }
});

// Delete a bulk
router.delete("/detelebulk/:id", fetchuser, async (req, res) => {
  const { number, message, contact, file } = req.body;
  try {
    let bulk = await Bulk.findById(req.params.id);
    if (!bulk) {
      return res.status(404).send("Not Found");
    }
    if (bulk.user.toString() !== req.user.id) {
      return res.status(401).send("Not Found");
    }
    bulk = await Bulk.findByIdAndDelete(req.params.id);
    res.json({ Success: "Bulk has been deleted", bulk: bulk });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
  }
});

module.exports = router;

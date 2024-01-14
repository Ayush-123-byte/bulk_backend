const express = require("express");
const Bulk = require("../models/Bulk");
const router = express.Router();
const { body, validationResult } = require("express-validator");
var fetchuser = require("../middleWare/fetchuser");
const upload = require("../middleWare/multer");
const uploadOnCloudinary = require("../utils/cloudinary");
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
  upload.fields([{ name: "file", maxCount: 1 }]),
  [
    body("number", "number expected of 5 digit").isLength({ min: 5 }),
    body("message", "invalid message").isLength({ min: 5 }),
    body("contact", "give right contact").isLength({ min: 5 }),
    // body("file", "give right file").exists(),
  ],
  async (req, res) => {
    // if there are error , return Bad request and the errors
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    try {
      const fileLocalPath = req.files?.file[0]?.path;

      if (!fileLocalPath) {
        return res.status(400).json({ error: error.message });
      }
      const file_img = await uploadOnCloudinary(fileLocalPath);

      if (!file_img) {
        return res.status(400).json({ error: "image is required" });
      }

      const { number, message, contact } = req.body;
      console.log(message);

      const createbulk = await Bulk.create({
        number,
        message,
        contact,
        file: file_img.url,
        user: req.user.id,
      });
      console.log(createbulk);
      res.status(200).json(createbulk);
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
    res.status(500).send("internal server error" + error.message);
  }
});

// Delete a bulk
router.delete("/detelebulk/:id", fetchuser, async (req, res) => {
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

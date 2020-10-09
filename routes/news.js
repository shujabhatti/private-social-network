const express = require("express");
const fs = require("fs");
const { promisify } = require("util");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const authMember = require("../middleware/authMember");
const { check, validationResult } = require("express-validator");
const News = require("../models/News");
const multer = require("multer");
const unlinkAsync = promisify(fs.unlink);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/news/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = function (req, file, cb) {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    // Accept file
    cb(null, true);
  } else {
    // Reject file
    cb("Only .JPEG or .PNG extensions are allowed!", false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter,
});

// @route   GET /api/news
// @des     Get all news
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const news = await News.find().sort({
      create_date: -1,
    });
    res.json(news);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     POST api/news
// @desc      Add new news
// @access    Private
router.post("/", auth, upload.single("newsImage"), async (req, res) => {
  const { title, description } = req.body;

  let news = await News.findOne({ title });

  if (news) {
    return res
      .status(400)
      .json({ msg: "News with this title already exists..!" });
  }

  let imagePath;
  let imageName;

  if (req.file !== undefined) {
    imagePath = "http:\\\\" + req.headers.host + "\\" + req.file.path;
    imageName = req.file.path;
  } else {
    imagePath = "";
    imageName = "";
  }

  try {
    news = new News({
      title,
      description,
      newsImage: imagePath,
      imageName: imageName,
      uploaded_by: req.user.id,
      update_by: req.user.id,
    });

    const result = await news.save();

    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     PUT api/news/:id
// @desc      Update news
// @access    Private
router.put("/:id", auth, upload.single("newsImage"), async (req, res) => {
  const { title, description } = req.body;

  let news = await News.findById(req.params.id);

  if (!news) {
    return res.status(404).json({ msg: "News not found" });
  }

  if (req.file !== undefined) {
    if (news.imageName !== "") {
      await unlinkAsync(news.imageName);
    }
  }

  let imagePath;
  let imageName;

  try {
    const newsFields = {};

    newsFields.title = title;
    newsFields.description = description;
    if (req.file !== undefined) {
      imagePath = "http:\\\\" + req.headers.host + "\\" + req.file.path;
      imageName = req.file.path;
      newsFields.newsImage = imagePath;
      newsFields.imageName = imageName;
    }
    newsFields.update_by = req.user.id;

    news = await News.findByIdAndUpdate(
      req.params.id,
      { $set: newsFields },
      { new: true }
    );

    res.json(news);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     DELETE api/news/:id
// @desc      Delete news
// @access    Private
router.delete("/:id", auth, async (req, res) => {
  try {
    let news = await News.findById(req.params.id);

    if (!news) return res.status(404).json({ msg: "News not found" });

    await unlinkAsync(news.imageName);

    await News.findByIdAndRemove(req.params.id);

    res.json({ msg: "News removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/news/readnews
// @des     Read all news
// @access  Private
router.get("/readnews", authMember, async (req, res) => {
  try {
    const news = await News.find().sort({
      create_date: -1,
    });
    res.json(news);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const News = require("../models/News");

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
router.post(
  "/",
  auth,
  [
    check("title", "Title is required").not().isEmpty(),
    check("description", "Description is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description } = req.body;

    try {
      let news = new News({
        title,
        description,
        uploaded_by: req.user.id,
        update_by: req.user.id,
      });

      const result = await news.save();

      res.json(result);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route     PUT api/members/:id
// @desc      Update member
// @access    Private
router.put(
  "/:id",
  auth,
  [
    check("title", "Title is required").not().isEmpty(),
    check("description", "Description is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description } = req.body;

    try {
      let news = await News.findById(req.params.id);

      if (!news) {
        return res.status(404).json({ msg: "News not found" });
      }

      const newsFields = {};

      newsFields.title = title;
      newsFields.description = description;
      newsFields.update_by = req.user.id;

      news = await News.findByIdAndUpdate(
        req.params.id,
        { $set: newsFields },
        { new: true }
      );

      res.json(news);
    } catch (err) {
      console.error(er.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route     DELETE api/news/:id
// @desc      Delete news
// @access    Private
router.delete("/:id", auth, async (req, res) => {
  try {
    let news = await News.findById(req.params.id);

    if (!news) return res.status(404).json({ msg: "News not found" });

    await News.findByIdAndRemove(req.params.id);

    res.json({ msg: "News removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

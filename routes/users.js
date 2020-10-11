const express = require("express");
const fs = require("fs");
const { promisify } = require("util");
const router = express.Router();
const User = require("../models/User");
const config = require("config");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const multer = require("multer");
const unlinkAsync = promisify(fs.unlink);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/users/");
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

const environment = process.env.NODE_ENV;

// @route   POST /api/users
// @desc    Register a user
// @access  Public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Valid Email is required").isEmail(),
    check("password", "Password must be of 6 or more characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ msg: "User already exists..!" });
      }
      user = new User({
        name,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      res.status(500).send("Server Error");
    }
  }
);

// @route   PUT /api/users
// @desc    Change user password
// @access  Private
router.put(
  "/change-password/",
  auth,
  [
    check("email", "Valid Email is required").isEmail(),
    check("password", "Password must be of 6 or more characters").isLength({
      min: 6,
    }),
    check("newpassword", "Password must be of 6 or more characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, newpassword } = req.body;

    try {
      let user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ msg: "User not found..!" });
      }

      const userfullinfo = await User.findById(req.user.id);

      if (userfullinfo.email !== email) {
        return res.status(400).json({
          msg: "Invalid email..!",
        });
      }

      const isMatch = await bcrypt.compare(password, userfullinfo.password);

      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid Password..!" });
      }

      const userFields = {};

      const salt = await bcrypt.genSalt(10);
      userFields.password = await bcrypt.hash(newpassword, salt);

      user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: userFields },
        { new: true }
      );

      res.status(200).json({ msg: "Password Changed..!" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route     PUT api/users/:id
// @desc      Update User
// @access    Private
router.put("/:id", auth, upload.single("userImage"), async (req, res) => {
  const { name } = req.body;

  let user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ msg: "User not found..!" });
  }

  if (req.file !== undefined) {
    if (user.imageName !== "") {
      await unlinkAsync(user.imageName);
    }
  }

  let imagePath;
  let imageName;

  try {
    const userFields = {};

    userFields.name = name;
    if (req.file !== undefined) {
      if (environment === "production") {
        imagePath = "https:\\\\" + req.headers.host + "\\" + req.file.path;
      } else {
        imagePath = "http:\\\\" + req.headers.host + "\\" + req.file.path;
      }
      imageName = req.file.path;
      userFields.userImage = imagePath;
      userFields.imageName = imageName;
    }

    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: userFields },
      { new: true }
    );

    res.status(200).json({ msg: "Changes Saved..!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

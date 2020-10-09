const express = require("express");
const router = express.Router();
const Member = require("../models/Member");
const config = require("config");
const auth = require("../middleware/authMember");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @route   GET /api/authmember
// @desc    Get logged in member
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const member = await Member.findById(req.member.id).select("-password");
    res.json(member);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/authmember
// @desc    Authenticate member and get token
// @access  Public
router.post("/", async (req, res) => {
  const { _id, password } = req.body;

  try {
    let member = await Member.findOne({ _id });

    if (!member) {
      return res.status(400).json({ msg: "Invalid ID..!" });
    }

    const isMatch = await bcrypt.compare(password, member.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Password..!" });
    }

    const payload = {
      member: {
        id: member._id,
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      {
        expiresIn: 360000,
      },
      (err, membertoken) => {
        if (err) throw err;
        res.json({ membertoken });
      }
    );
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;

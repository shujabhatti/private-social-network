const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const Member = require("../models/Member");

// @route   GET /api/members
// @des     Get all members
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const members = await Member.find({}).sort({
      create_date: -1,
    });
    res.json(members);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     POST api/members
// @desc      Add new member
// @access    Private
router.post(
  "/",
  [
    auth,
    [
      check("_id", "Member id is required").not().isEmpty(),
      check("name", "Name is required").not().isEmpty(),
      check("email", "Valid Email is required").isEmail(),
      check("password", "Password must be of 6 or more characters").isLength({
        min: 6,
      }),
      check("member_type", "Member type is required").not().isEmpty(),
      check("acc_status", "Account status is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      _id,
      name,
      email,
      password,
      member_type,
      program,
      course,
      year,
      acc_status,
    } = req.body;

    try {
      let member = await Member.findOne({ _id });

      if (member) {
        return res
          .status(400)
          .json({ msg: "Member with this id already exists..!" });
      }

      if (member_type === "Student") {
        member = new Member({
          _id,
          name,
          email,
          password,
          member_type,
          program,
          course,
          year,
          acc_status,
          update_by: req.user.id,
        });
      } else {
        member = new Member({
          _id,
          name,
          email,
          password,
          member_type,
          acc_status,
          update_by: req.user.id,
        });
      }

      const salt = await bcrypt.genSalt(10);
      member.password = await bcrypt.hash(password, salt);

      const result = await member.save();

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
    check("name", "Name is required").not().isEmpty(),
    check("email", "Valid Email is required").isEmail(),
    check("member_type", "Member type is required").not().isEmpty(),
    check("acc_status", "Account status is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      email,
      member_type,
      program,
      course,
      year,
      acc_status,
    } = req.body;

    try {
      let member = await Member.findById(req.params.id);

      if (!member) {
        return res.status(404).json({ msg: "Member not found" });
      }

      const memberFields = {};

      memberFields.name = name;
      memberFields.email = email;
      memberFields.member_type = member_type;
      if (member_type === "Student") {
        memberFields.program = program;
        memberFields.course = course;
        memberFields.year = year;
      } else {
        memberFields.program = "";
        memberFields.course = "";
        memberFields.year = "";
      }
      memberFields.acc_status = acc_status;
      memberFields.update_by = req.user.id;

      member = await Member.findByIdAndUpdate(
        req.params.id,
        { $set: memberFields },
        { new: true }
      );

      res.json(member);
    } catch (err) {
      console.error(er.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route     PUT api/members/change-password/:id
// @desc      Update member password
// @access    Private
router.put(
  "/change-password/:id",
  auth,
  [
    check("password", "Password must be of 6 or more characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { password } = req.body;

    try {
      let member = await Member.findById(req.params.id);

      if (!member) {
        return res.status(404).json({ msg: "Member not found" });
      }

      const memberFields = {};

      const salt = await bcrypt.genSalt(10);
      memberFields.password = await bcrypt.hash(password, salt);
      memberFields.update_by = req.user.id;

      member = await Member.findByIdAndUpdate(
        req.params.id,
        { $set: memberFields },
        { new: true }
      );

      res.json(member);
    } catch (err) {
      console.error(er.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route     DELETE api/members/:id
// @desc      Delete member
// @access    Private
router.delete("/:id", auth, async (req, res) => {
  try {
    let member = await Member.findById(req.params.id);

    if (!member) return res.status(404).json({ msg: "Member not found" });

    await Member.findByIdAndRemove(req.params.id);

    res.json({ msg: "Member removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

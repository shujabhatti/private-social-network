const express = require("express");
const fs = require("fs");
const { promisify } = require("util");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const Member = require("../models/Member");
const multer = require("multer");
const unlinkAsync = promisify(fs.unlink);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/members/");
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
router.post("/", auth, upload.single("memberImage"), async (req, res) => {
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

  let member = await Member.findOne({ _id });

  if (member) {
    return res
      .status(400)
      .json({ msg: "Member with this id already exists..!" });
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
        memberImage: imagePath,
        imageName: imageName,
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
        memberImage: imagePath,
        imageName: imageName,
        update_by: req.user.id,
      });
    }

    const salt = await bcrypt.genSalt(10);
    member.password = await bcrypt.hash(password, salt);

    const result = await member.save();

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// @route     PUT api/members/:id
// @desc      Update member
// @access    Private
router.put("/:id", auth, upload.single("memberImage"), async (req, res) => {
  const {
    name,
    email,
    member_type,
    program,
    course,
    year,
    acc_status,
  } = req.body;

  let member = await Member.findById(req.params.id);

  if (!member) {
    return res.status(404).json({ msg: "Member not found" });
  }

  if (req.file !== undefined) {
    if (member.imageName !== "") {
      await unlinkAsync(member.imageName);
    }
  }

  let imagePath;
  let imageName;

  try {
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
    if (req.file !== undefined) {
      imagePath = "http:\\\\" + req.headers.host + "\\" + req.file.path;
      imageName = req.file.path;
      memberFields.memberImage = imagePath;
      memberFields.imageName = imageName;
    }
    memberFields.update_by = req.user.id;

    member = await Member.findByIdAndUpdate(
      req.params.id,
      { $set: memberFields },
      { new: true }
    );

    res.json(member);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     PUT api/members/change-profile/:id
// @desc      Update image
// @access    Private
router.put(
  "/change-profile/:id",
  auth,
  upload.single("memberImage"),
  async (req, res) => {
    try {
      let member = await Member.findById(req.params.id);

      if (!member) {
        return res.status(404).json({ msg: "Member not found" });
      }

      await unlinkAsync(member.imageName);

      let imagePath;
      let imageName;

      if (req.file !== undefined) {
        imagePath = "http:\\\\" + req.headers.host + "\\" + req.file.path;
        imageName = req.file.path;
      } else {
        imagePath = "";
        imageName = "";
      }

      const memberFields = {};
      memberFields.memberImage = imagePath;
      memberFields.imageName = imageName;
      memberFields.update_by = req.user.id;

      member = await Member.findByIdAndUpdate(
        req.params.id,
        { $set: memberFields },
        { new: true }
      );

      res.json(member);
    } catch (err) {
      console.error(err.message);
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

    await unlinkAsync(member.imageName);

    await Member.findByIdAndRemove(req.params.id);

    res.json({ msg: "Member removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

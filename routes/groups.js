const express = require("express");
const fs = require("fs");
const { promisify } = require("util");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const authMember = require("../middleware/authMember");
const { check, validationResult } = require("express-validator");
const Group = require("../models/Group");
const Member = require("../models/Member");
const multer = require("multer");
const unlinkAsync = promisify(fs.unlink);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/groups/");
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

// @route   GET /api/groups
// @des     Get all groups
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const groups = await Group.find().sort({
      create_date: -1,
    });
    res.json(groups);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     GET api/groups/:id
// @desc      Get group by id
// @access    Private
router.get("/:id", auth, async (req, res) => {
  try {
    let group = await Group.findById(req.params.id);

    if (!group) return res.status(404).json({ msg: "Group not found" });

    res.json(group);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     POST api/groups
// @desc      Add new group
// @access    Private
router.post("/", auth, upload.single("groupImage"), async (req, res) => {
  const { title } = req.body;

  let group = await Group.findOne({ title });

  if (group) {
    return res
      .status(400)
      .json({ msg: "Group with this title already exists..!" });
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
    group = new Group({
      title,
      groupImage: imagePath,
      imageName: imageName,
      update_by: req.user.id,
    });

    const result = await group.save();

    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     PUT api/groups/:id
// @desc      Update group
// @access    Private
router.put("/:id", auth, upload.single("groupImage"), async (req, res) => {
  const { title } = req.body;

  let group = await Group.findById(req.params.id);

  if (!group) {
    return res.status(404).json({ msg: "Group not found" });
  }

  if (req.file !== undefined) {
    if (group.imageName !== "") {
      await unlinkAsync(group.imageName);
    }
  }

  let imagePath;
  let imageName;

  try {
    const groupFields = {};

    groupFields.title = title;
    if (req.file !== undefined) {
      imagePath = "http:\\\\" + req.headers.host + "\\" + req.file.path;
      imageName = req.file.path;
      groupFields.groupImage = imagePath;
      groupFields.imageName = imageName;
    }
    groupFields.update_by = req.user.id;

    group = await Group.findByIdAndUpdate(
      req.params.id,
      { $set: groupFields },
      { new: true }
    );

    res.json(group);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     DELETE api/groups/:id
// @desc      Delete group
// @access    Private
router.delete("/:id", auth, async (req, res) => {
  try {
    let group = await Group.findById(req.params.id);

    if (!group) return res.status(404).json({ msg: "Group not found" });

    await unlinkAsync(group.imageName);

    await Group.findByIdAndRemove(req.params.id);

    res.json({ msg: "Group deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     GET api/groups/member-group/:id
// @desc      Get group by from token by member
// @access    Private
router.get("/member-group/:id", authMember, async (req, res) => {
  try {

    const currentMember = await Member.findById(req.member.id);

    const group = await Group.findById(currentMember.member_type);
    
    if (!group) return res.status(404).json({ msg: "Group not found" });

    res.json(group);
  
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
  
});

module.exports = router;

const mongoose = require("mongoose");

const MemberScheme = new mongoose.Schema({
  _id: {
    type: String,
    trim: true,
    required: [true, "member id is required"],
  },
  name: {
    type: String,
    trim: true,
    required: [true, "name is required"],
  },
  email: {
    type: String,
    trim: true,
    required: [true, "email is required"],
  },
  password: {
    type: String,
    trim: true,
    required: [true, "password is required"],
  },
  member_type: {
    type: String,
    trim: true,
    required: [true, "member type is required"],
  },
  program: {
    type: String,
    trim: true,
    default: "",
  },
  course: {
    type: String,
    trim: true,
    default: "",
  },
  year: {
    type: String,
    trim: true,
    default: "",
  },
  acc_status: {
    type: String,
    trim: true,
    required: [true, "account status is required"],
  },
  create_date: {
    type: Date,
    default: Date.now,
  },
  update_by: {
    type: String,
    trim: true,
    required: [true, "name of user, update by is required"],
  },
  imageName: {
    type: String,
    default: "",
  },
  memberImage: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Member", MemberScheme);

const mongoose = require("mongoose");

const GroupScheme = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "title is required"],
  },
  create_date: {
    type: Date,
    default: Date.now,
  },
  update_by: {
    type: String,
    trim: true,
    required: [true, "name of user, updated by is required"],
  },
  imageName: {
    type: String,
    default: "",
  },
  groupImage: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Groups", GroupScheme);

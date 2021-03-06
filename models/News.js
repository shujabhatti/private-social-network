const mongoose = require("mongoose");

const NewsScheme = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "title is required"],
  },
  description: {
    type: String,
    trim: true,
    required: [true, "description is required"],
  },
  create_date: {
    type: Date,
    default: Date.now,
  },
  uploaded_by: {
    type: String,
    trim: true,
    required: [true, "name of user, uploaded by is required"],
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
  newsImage: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("News", NewsScheme);

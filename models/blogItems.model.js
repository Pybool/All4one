const mongoose = require("mongoose");

// Define a Mongoose schema for the message fields
const blogs = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  body: {
    type: String,
    required: true,
  },

  enumerablesTitle: {
    type: String,
    required: true,
  },

  enumerables: [],

  images: [],

  createdAt: {
    type: Date,
    required: true,
  },
});

// Create a Mongoose model using the schema
const Blogs = mongoose.model("Blogs", blogs);

module.exports = Blogs;

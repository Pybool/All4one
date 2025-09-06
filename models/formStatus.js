// models/FormStatus.js
const mongoose = require("mongoose");

const formStatusSchema = new mongoose.Schema({
  formKey: { type: String, required: true, unique: true }, // e.g. "job-application"
  enabled: { type: Boolean, default: true }, // whether submissions are allowed
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FormStatus", formStatusSchema);

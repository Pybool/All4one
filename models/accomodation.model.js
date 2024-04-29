const mongoose = require("mongoose");

const accomodationSchema = new mongoose.Schema({
  
  name: { type: String, required: false },
  location: { type: String, required: false },
  description: { type: String, required: false },
  images: [{ type: String, required: false }],
  createdAt: { type: Date, required: false },
});

const Accomodation = mongoose.model("accomodation", accomodationSchema);

module.exports = Accomodation;

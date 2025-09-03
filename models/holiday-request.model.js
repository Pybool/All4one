
const slugify = require("slugify");
const mongoose = require('mongoose');

const HolidayRequestSchema = new mongoose.Schema(
  {
    data: {
      type: mongoose.Schema.Types.Mixed, // store the entire JSON payload
      default: {},
    },
    
  },
  { timestamps: true }
);


// Create a Mongoose model using the schema
const HolidayRequest = mongoose.model("HolidayRequest", HolidayRequestSchema);

module.exports = HolidayRequest;


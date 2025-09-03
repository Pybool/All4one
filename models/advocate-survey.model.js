
const slugify = require("slugify");
const mongoose = require('mongoose');

const AdvocateSurveySchema = new mongoose.Schema(
  {
    data: {
      type: mongoose.Schema.Types.Mixed, // store the entire JSON payload
      default: {},
    },
    
  },
  { timestamps: true }
);


// Create a Mongoose model using the schema
const AdvocateSurvey = mongoose.model("AdvocateSurvey", AdvocateSurveySchema);

module.exports = AdvocateSurvey;


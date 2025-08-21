const slugify = require("slugify");
const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    positionAppliedFor: {
      type: String,
      required: true,
      index: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed, // store the entire JSON payload
      default: {},
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
    applicantId: {
      type: String,
      unique: true,
      sparse: true, // allow null initially
    },
  },
  { timestamps: true }
);

// Before saving, auto-slugify positionAppliedFor
ApplicationSchema.pre("save", function (next) {
  if (this.data?.positionAppliedFor) {
    this.positionAppliedFor = slugify(this.data.positionAppliedFor, {
      lower: true,
      strict: true,
    });
  }
  next();
});

// Create a Mongoose model using the schema
const JobApplication = mongoose.model("JobApplication", ApplicationSchema);

module.exports = JobApplication;


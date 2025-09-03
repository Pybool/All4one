const slugify = require("slugify");
const mongoose = require('mongoose');

const recruitmentReferenceSchema = new mongoose.Schema(
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
    }
  },
  { timestamps: true }
);

// Before saving, auto-slugify positionAppliedFor
recruitmentReferenceSchema.pre("save", function (next) {
  if (this.data?.positionAppliedFor) {
    this.positionAppliedFor = slugify(this.data.positionAppliedFor, {
      lower: true,
      strict: true,
    });
  }
  next();
});

// Before saving, auto-slugify companyName
recruitmentReferenceSchema.pre("save", function (next) {
  if (this.data?.companyName) {
    this.companyName = slugify(this.data.companyName, {
      lower: true,
      strict: true,
    });
  }
  next();
});

// Create a Mongoose model using the schema
const RecruitmentReference = mongoose.model("RecruitmentReference", recruitmentReferenceSchema);

module.exports = RecruitmentReference;


const JobApplication = require("../models/application.model.js");
const slugify = require("slugify");
const ejs = require("ejs");
const juice = require("juice");
const sendMail = require("../services/mailservice");
const dotenv = require("dotenv");

dotenv.config();

function generateUniqueCode(prefix = "APP") {
  // Current timestamp in base36 (shorter and unique for each millisecond)
  const timestamp = Date.now().toString(36).toUpperCase();

  // Random 4-character alphanumeric string
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();

  // Combine prefix, timestamp, and random segment
  return `${prefix}-${timestamp}-${random}`;
}

const submitApplication = async (req, res) => {
  try {
    let response;
    let applicationData = req.body;

    // === Validation if complete ===
    // if (req.query.iscomplete === "1" || req.query.iscomplete === "true") {
    //   let errors = validateApplicationForm(applicationData);
    //   if (errors.length > 0) {
    //     return res.send({
    //       status: false,
    //       message:
    //         "Please fill up all required fields, ensure all email addresses and phone numbers are valid. Phone numbers must be UK format (+44...).",
    //     });
    //   }
    //   applicationData.isComplete = true;
    // }

    applicationData.isComplete = true;

    // === Ensure email exists ===
    if (!applicationData?.email?.trim()) {
      return res.send({
        status: false,
        message: "You must enter an email address",
      });
    }

    // === Slugify the position ===
    const slug = applicationData.positionAppliedFor
      ? slugify(applicationData.positionAppliedFor, {
          lower: true,
          strict: true,
        })
      : "unknown";

    let exists = await JobApplication.findOne({
      email: applicationData.email,
      positionAppliedFor: slug,
      isComplete: true,
    });

    if (exists) {
      return res.send({
        status: false,
        message: "You have already applied for this position",
      });
    }

    // === Upsert Application ===
    let dbApplication = await JobApplication.findOneAndUpdate(
      { email: applicationData.email, positionAppliedFor: slug },
      {
        $set: {
          email: applicationData.email,
          positionAppliedFor: slug,
          data: applicationData, // dump full payload
          isComplete: applicationData.isComplete || false,
        },
      },
      { upsert: true, new: true, runValidators: true }
    );

    // === Assign applicantId if not exists ===
    if (!dbApplication.applicantId) {
      dbApplication.applicantId = generateUniqueCode("A41");
      await dbApplication.save();
    }

    // === Prepare Response ===
    response = {
      status: true,
      data: dbApplication,
      message: "Application has been submitted successfully",
    };

    // === Send Email Notification only if Complete ===
    if (applicationData.isComplete) {
      let emailOrName = dbApplication?.data?.firstName || dbApplication.email;

      const template = await ejs.renderFile(
        "views/pages/emailtemplates/applicationsuccess_email.ejs",
        { emailOrName, applicationId: dbApplication.applicantId }
      );

      const mailOptions = {
        from: process.env.EMAIL_HOST_USER,
        to: dbApplication.email,
        subject: "All4One Career Application Form",
        text: `Application with application id ${dbApplication.applicantId} created or modified`,
        html: juice(template),
      };

      sendMail(mailOptions)
        .then((resp) => console.log("Email sent:", resp))
        .catch((err) => console.error("Email error:", err));
    }

    res.send(response);
  } catch (error) {
    console.error(error);
    res.send({
      status: false,
      message: "Something went wrong while submitting application",
    });
  }
};

const fetchApplications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default page = 1
    const limit = parseInt(req.query.limit) || 10; // Default limit = 10
    const skip = (page - 1) * limit;

    // Fetch applications with pagination
    const applications = await JobApplication.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // latest first

    // Get total count for frontend pagination
    const total = await JobApplication.countDocuments();

    res.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      applications,
    });
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { submitApplication, fetchApplications };

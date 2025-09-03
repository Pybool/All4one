const JobApplication = require("../models/application.model.js");
const RecruitmentReference = require("../models/recruitment-reference.model.js");
const AdvocateSurvey =  require("../models/advocate-survey.model.js");
const HolidayRequest = require("../models/holiday-request.model.js");
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

const submitRecruitmentForm = async (req, res) => {
  try {
    let response;
    let recruitmentRef = req.body;

    recruitmentRef.isComplete = true;

    // === Ensure email exists ===
    if (!recruitmentRef?.email?.trim()) {
      return res.send({
        status: false,
        message: "You must enter an email address",
      });
    }

    // === Slugify the position ===
    const slug = recruitmentRef.positionAppliedFor
      ? slugify(recruitmentRef.positionAppliedFor, {
          lower: true,
          strict: true,
        })
      : "unknown";

    const companyNameSlug = recruitmentRef.companyName
      ? slugify(recruitmentRef.companyName, {
          lower: true,
          strict: true,
        })
      : "unknown";

    let exists = await RecruitmentReference.findOne({
      email: recruitmentRef.email,
      positionAppliedFor: slug,
      companyName: companyNameSlug,
      isComplete: true,
    });

    if (exists) {
      return res.send({
        status: false,
        message: "You have already referred candidate for this position",
      });
    }

    // === Upsert Application ===
    let dbApplication = await RecruitmentReference.findOneAndUpdate(
      {
        email: recruitmentRef.email,
        positionAppliedFor: slug,
        companyName: companyNameSlug,
      },
      {
        $set: {
          email: recruitmentRef.email,
          positionAppliedFor: slug,
          data: recruitmentRef, // dump full payload
          isComplete: recruitmentRef.isComplete || false,
        },
      },
      { upsert: true, new: true, runValidators: true }
    );

    // === Prepare Response ===
    response = {
      status: true,
      data: dbApplication,
      message: "Reference has been submitted successfully",
    };

    // === Send Email Notification only if Complete ===
    if (recruitmentRef.isComplete) {
      let emailOrName = dbApplication?.data?.firstName || dbApplication.email;

      const template = await ejs.renderFile(
        "views/pages/emailtemplates/referencesuccess_email.ejs",
        { emailOrName, applicationId: dbApplication.applicantId }
      );

      const mailOptions = {
        from: process.env.EMAIL_HOST_USER,
        to: dbApplication.email,
        subject: "All4One Career Reference Form",
        text: `Reference submitted`,
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
      message: "Something went wrong while submitting reference",
    });
  }
};

const fetchReferences = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default page = 1
    const limit = parseInt(req.query.limit) || 10; // Default limit = 10
    const skip = (page - 1) * limit;

    // Fetch applications with pagination
    const references = await RecruitmentReference.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // latest first

    // Get total count for frontend pagination
    const total = await RecruitmentReference.countDocuments();

    res.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      references,
    });
  } catch (err) {
    console.error("Error fetching references:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const advocateSurveyForm = async (req, res) => {
  try {
    let response;
    let survey = req.body;
    // === Upsert Application ===
    let advocateSurvey = await AdvocateSurvey.create(survey);

    // === Prepare Response ===
    response = {
      status: true,
      data: advocateSurvey,
      message: "Survey has been submitted successfully, Thank you!",
    };
    res.send(response);
  } catch (error) {
    console.error(error);
    res.send({
      status: false,
      message: "Something went wrong while submitting survey",
    });
  }
};

const fetchAdvocateSurveys = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default page = 1
    const limit = parseInt(req.query.limit) || 10; // Default limit = 10
    const skip = (page - 1) * limit;

    // Fetch applications with pagination
    const surveys = await AdvocateSurvey.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // latest first

    // Get total count for frontend pagination
    const total = await AdvocateSurvey.countDocuments();

    res.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      surveys,
    });
  } catch (err) {
    console.error("Error fetching surveys:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const holidayRequestForm = async (req, res) => {
  try {
    let response;
    let holidayRequestData = req.body;
    // === Upsert Application ===
    let holidayRequest = await HolidayRequest.create(holidayRequestData);

    // === Prepare Response ===
    response = {
      status: true,
      data: holidayRequest,
      message: "Holiday request has been submitted successfully",
    };
    res.send(response);
  } catch (error) {
    console.error(error);
    res.send({
      status: false,
      message: "Something went wrong while submitting holiday request",
    });
  }
};

const holidayRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default page = 1
    const limit = parseInt(req.query.limit) || 10; // Default limit = 10
    const skip = (page - 1) * limit;

    // Fetch applications with pagination
    const holidayRequests = await HolidayRequest.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // latest first

    // Get total count for frontend pagination
    const total = await HolidayRequest.countDocuments();

    res.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      holidayRequests,
    });
  } catch (err) {
    console.error("Error fetching holiday requests:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  submitApplication,
  fetchApplications,
  submitRecruitmentForm,
  fetchReferences,
  advocateSurveyForm,
  fetchAdvocateSurveys,
  holidayRequestForm,
  holidayRequests
};

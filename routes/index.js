const express = require("express");
const data = require("./services");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const indexControllers = require("../controllers/index");
const authControllers = require("../controllers/auth");
const {
  submitApplication,
  fetchApplications,
  submitRecruitmentForm,
  fetchReferences,
  advocateSurveyForm,
  fetchAdvocateSurveys,
  holidayRequestForm,
  holidayRequests,
} = require("../controllers/application");
const blogsData = require("../models/blogs.mock");
const AccomodationService = require("../services/accomodation.service");
const auth = require("../services/auth");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const router = express.Router();
const axios = require("axios");
const FormStatus = require("../models/formStatus");
const {verifyToken, isAdmin, checkFormEnabled} = require('../services/middleware')

const { generalLimiter, formLimiter } = require("./rateLimiter");

dotenv.config();

const footerFeeds = [
  "benefits-of-live-in-care-for-dementia",
  "challenging-behaviour-in-dementia",
  "what-is-domiciliary-care",
  "right-to-carers-leave",
];

const minimalFeeds = blogsData.relatedFeedsBuilder(footerFeeds);
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY; // Replace with your Secret Key

function getCurrentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
// Define storage for the uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join("public", "assets/uploads", getCurrentDate());
    fs.mkdirSync(uploadDir, { recursive: true }); // Create directory if not exists
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Use current timestamp as filename
  },
});

/**
 * Create a JWT token
 * @param {Object} payload - The data you want to embed in the token (e.g. user info)
 * @param {String} [expiresIn="1h"] - Expiration time (e.g. "1h", "7d")
 * @returns {String} - The signed JWT
 */
function createToken(payload, expiresIn = "30s") {
  const secret = process.env.JWT_SECRET || "some secret"; // use the same secret as in verifyToken
  return jwt.sign(payload, secret, { expiresIn });
}


// Initialize multer upload middleware
const upload = multer({ storage: storage });

router.get("/", generalLimiter, (req, res, next) => {
  res.send({
    title: "All 4 Care Services BACKEND",
  });
});

router.post("/api/v1/contact-us", formLimiter, indexControllers.sendMessage);

router.post(
  "/api/v1/submit-application",
  formLimiter,
  verifyToken,
  indexControllers.submitApplication
);

router.post(
  "/api/v1/job-application",
  formLimiter,
  verifyToken,
  submitApplication
);

router.get(
  "/api/v1/fetch-application",
  formLimiter,
  verifyToken,
  indexControllers.getApplication
);

router.get(
  "/api/v1/get-job-applications",
  generalLimiter,
  isAdmin,
  fetchApplications
);

router.get(
  "/api/v1/get-job-references",
  generalLimiter,
  isAdmin,
  fetchReferences
);

router.get(
  "/api/v1/get-advocate-surveys",
  generalLimiter,
  isAdmin,
  fetchAdvocateSurveys
);

router.get(
  "/api/v1/get-holiday-requests",
  generalLimiter,
  isAdmin,
  holidayRequests
);

router.post(
  "/api/v1/recruitment-form",
  formLimiter,
  verifyToken,
  submitRecruitmentForm
);

router.post(
  "/api/v1/advocate-survey-form",
  formLimiter,
  verifyToken,
  advocateSurveyForm
);

router.post(
  "/api/v1/holiday-request-form",
  formLimiter,
  verifyToken,
  holidayRequestForm
);

router.get(
  "/api/v1/get-holiday-request",
  formLimiter,
  verifyToken,
  holidayRequests
);

router.post(
  "/api/v1/subscribe-newsletter",
  formLimiter,
  indexControllers.subscribeNewsLetter
);

router.post(
  "/api/v1/append-signature",
  formLimiter,
  upload.single("signature"),
  indexControllers.appendApplicationSignature
);

router.post(
  "/api/v1/admin-register",
  formLimiter,
  authControllers.createAccount
);

router.post("/api/v1/admin-login", formLimiter, async (req, res, next) => {
  const auth = await authControllers.signIn(req, res, next);
  if (auth.token) {
    return res.json({ pageTitle: "Login page", context: auth });
  }
  return res.json({ pageTitle: "Login page", context: auth });
});

router.get("/admin", generalLimiter, async (req, res, next) => {
  const accomodations = await AccomodationService.getAccomodations();
  return res.render("pages/adminpanel", {
    pageTitle: "Administration",
    context: accomodations?.data,
    minimalFeeds,
  });
});

router.get("/auth-admin", generalLimiter, async (req, res, next) => {
  try {
    const token = atob(req.query._t);
    if (!token) {
      return res.redirect(401, "/login");
    }
    const decodedToken = auth.decodeToken(token);
    if (decodedToken) {
      const accomodations = await AccomodationService.getAccomodations();
      return res.render("pages/adminpanel", {
        pageTitle: "Administration",
        context: accomodations?.data,
      });
    } else {
      return res.redirect(401, "/login");
    }
  } catch {
    return res.redirect(401, "/login");
  }
});

router.post("/api/v1/verify-recaptcha", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "No token provided" });
  }

  try {
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: RECAPTCHA_SECRET_KEY,
          response: token,
        },
      }
    );

    const data = response.data;
    if (data.success) {
      // reCAPTCHA verification successful
      res.json({
        success: true,
        message: "reCAPTCHA successful",
        token: createToken(req.body),
      });
    } else {
      // reCAPTCHA verification failed
      res
        .status(400)
        .json({
          success: false,
          message: "reCAPTCHA failed",
          errors: data["error-codes"],
        });
    }
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// Get all form statuses
router.get("/api/v1/forms/status", async (req, res) => {
  try {
    const statuses = await FormStatus.find();
    res.json(statuses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching form statuses" });
  }
});

// Get status for one form
router.get("/api/v1/forms/status/:formKey", async (req, res) => {
  try {
    const form = await FormStatus.findOne({ formKey: req.params.formKey });
    if (!form) return res.status(404).json({ message: "Form not found" });
    res.json(form);
  } catch (err) {
    res.status(500).json({ message: "Error fetching form status" });
  }
});

// Update/toggle form status
router.post("/api/v1/forms/status/:formKey", async (req, res) => {
  try {
    const { enabled } = req.body;
    const form = await FormStatus.findOneAndUpdate(
      { formKey: req.params.formKey },
      { enabled, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json(form);
  } catch (err) {
    res.status(500).json({ message: "Error updating form status" });
  }
});

module.exports = router;

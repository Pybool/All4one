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
  holidayRequests
} = require("../controllers/application");
const blogsData = require("../models/blogs.mock");
const AccomodationService = require("../services/accomodation.service");
const auth = require("../services/auth");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const router = express.Router();

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

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Expected format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const secret = process.env.JWT_SECRET || "some secret";
    const decoded = jwt.verify(token, secret);
    // Attach decoded payload to request so other routes can use it
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Error verifying token:", err);
    return res.status(403).json({ message: "Invalid or expired token." });
  }
}

// Initialize multer upload middleware
const upload = multer({ storage: storage });

router.get("/", generalLimiter, (req, res, next) => {
  res.send({
    title: "All 4 Care Services BACKEND",
  });
});

router.post("/api/v1/contact-us", formLimiter, indexControllers.sendMessage);

router.post("/api/v1/submit-application", formLimiter, verifyToken, indexControllers.submitApplication);

router.post("/api/v1/job-application", formLimiter, verifyToken, submitApplication);

router.get("/api/v1/fetch-application", formLimiter, verifyToken, indexControllers.getApplication);

router.get("/api/v1/get-job-applications", formLimiter, verifyToken, fetchApplications);

router.get("/api/v1/get-job-references", formLimiter, verifyToken, fetchReferences);

router.get("/api/v1/get-advocate-surveys", formLimiter, verifyToken, fetchAdvocateSurveys);

router.get("/api/v1/get-holiday-requests", formLimiter, verifyToken, holidayRequests);

router.post("/api/v1/recruitment-form", formLimiter, verifyToken, submitRecruitmentForm);

router.post("/api/v1/advocate-survey-form", formLimiter, verifyToken, advocateSurveyForm);

router.post("/api/v1/holiday-request-form", formLimiter, verifyToken, holidayRequestForm);

router.get("/api/v1/get-holiday-request", formLimiter, verifyToken, holidayRequests);


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

router.post("/api/v1/admin-register", formLimiter, authControllers.createAccount);

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



router.post('/verify-recaptcha', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: 'No token provided' });
  }

  try {
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
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
      res.json({ success: true, message: 'reCAPTCHA successful' });
    } else {
      // reCAPTCHA verification failed
      res.status(400).json({ success: false, message: 'reCAPTCHA failed', errors: data['error-codes'] });
    }
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

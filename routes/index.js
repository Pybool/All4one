const express = require("express");
const data = require("./services");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const indexControllers = require("../controllers/index");
const authControllers = require("../controllers/auth");
const {submitApplication, fetchApplications} = require("../controllers/application");
const blogsData = require("../models/blogs.mock");
const AccomodationService = require("../services/accomodation.service");
const auth = require("../services/auth");

const router = express.Router();

const footerFeeds = [
  "benefits-of-live-in-care-for-dementia",
  "challenging-behaviour-in-dementia",
  "what-is-domiciliary-care",
  "right-to-carers-leave"
]

const minimalFeeds = blogsData.relatedFeedsBuilder(footerFeeds);

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

// Initialize multer upload middleware
const upload = multer({ storage: storage });

router.get("/", (req, res, next) => {
  res.send({
    title: "All 4 Care Services BACKEND",
  });
});

router.post("/api/v1/contact-us", indexControllers.sendMessage);

router.post("/api/v1/submit-application", indexControllers.submitApplication);

router.post("/api/v1/job-application", submitApplication)

router.get("/api/v1/fetch-application", indexControllers.getApplication);

router.get("/api/v1/get-job-applications", fetchApplications);

router.post(
  "/api/v1/subscribe-newsletter",
  indexControllers.subscribeNewsLetter
);

router.post(
  "/api/v1/append-signature",
  upload.single("signature"),
  indexControllers.appendApplicationSignature
);

router.post("/api/v1/admin-register", authControllers.createAccount);

router.post("/api/v1/admin-login", async (req, res, next) => {
  const auth = await authControllers.signIn(req, res, next);
  console.log("auth ==> ",auth)
  if (auth.token) {
    return res.json({ pageTitle: "Login page", context: auth });
  }
  return res.json({ pageTitle: "Login page", context: auth });
});


router.get("/admin", async (req, res, next) => {
    const accomodations = await AccomodationService.getAccomodations();
    return res.render("pages/adminpanel", {
      pageTitle: "Administration",
      context: accomodations?.data,
      minimalFeeds
    });
});

router.get("/auth-admin", async (req, res, next) => {
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

module.exports = router;

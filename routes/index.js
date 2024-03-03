const express = require("express");
const data = require("./services");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const indexControllers = require("../controllers/index");

const router = express.Router();

function getCurrentDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
// Define storage for the uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join('public', 'assets/uploads', getCurrentDate());
        fs.mkdirSync(uploadDir, { recursive: true }); // Create directory if not exists
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Use current timestamp as filename
    }
});

// Initialize multer upload middleware
const upload = multer({ storage: storage });


router.get("/", (req, res, next) => {
  res.render("pages/index", {
    title: "All 4 Care Services Uk",
  });
});

router.get("/blog-details", (req, res, next) => {
  res.render("blog-details", { pageTitle: "Blog Details", content: "" });
});

router.get("/about-us", (req, res, next) => {
  res.render("pages/about", { pageTitle: "About Us", content: "" });
});

router.get("/services-details", (req, res, next) => {
    res.render("pages/service-details", { pageTitle: "Service Details", servicesDetails: data.servicesDetails });
});

router.get("/services", (req, res, next) => {
    res.render("pages/services", { pageTitle: "Services", content: "" });
});

router.get("/contact", (req, res, next) => {
    res.render("pages/contact", { pageTitle: "contact Form", content: "" });
});

router.get("/appointment", (req, res, next) => {
    res.render("pages/appointment", { pageTitle: "Appointment Form", content: "" });
});

router.get("/careers", (req, res, next) => {
    res.render("pages/careers", { pageTitle: "Application Form", content: "" });
});

// router.get("/team", (req, res, next) => {
//     res.render("pages/team", { pageTitle: "Team", team: data.team });
// });

// router.get("/team-details", (req, res, next) => {
//     res.render("pages/team-details", { pageTitle: "Team detail", teamMember: data.getTeamMemberById(parseInt(req.query.id)) });
// });

router.post("/api/v1/contact-us", indexControllers.sendMessage);

router.post("/api/v1/submit-application", indexControllers.submitApplication);

router.get("/api/v1/fetch-application", indexControllers.getApplication);

router.post("/api/v1/subscribe-newsletter", indexControllers.subscribeNewsLetter);

router.post("/api/v1/append-signature", upload.single('signature'), indexControllers.appendApplicationSignature);









module.exports = router;

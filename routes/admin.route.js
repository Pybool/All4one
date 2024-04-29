const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const adminController = require("../controllers/admin");

const router = express.Router();

function getCurrentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
// Define storage for the uploaded files
const storageEngine = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(
      "public",
      "assets/tempuploads/accomodations",
      getCurrentDate()
    );
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

//Initializing upload
const upload = multer({
  storage: storageEngine,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

const checkFileType = function (file, cb) {
  const fileTypes = /jpeg|jpg|png|webp|gif|svg/;
  const extName = fileTypes.test(path.extname(file.originalname));
  console.log(path.extname(file.originalname));

  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("Error: You can Upload Images Only!!");
  }
};

router.post("/create-accomodation", upload.array("images", 20), adminController.createAccomodation);

module.exports = router;

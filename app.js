const createError = require("http-errors");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const https = require('https');
const http = require('http');
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const dotenv = require("dotenv");
const debug = require("debug")("express");
const indexRouter = require("./routes/index");
const adminRouter = require("./routes/admin.route");

const fs = require('fs');
const app = express();

dotenv.config();

const PORT = process.env.PORT || 4000;

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use(
  express.static(path.join(__dirname, "public"), {
    maxAge: "1d",
  })
);

app.use("/", indexRouter);
app.use("/api/v1", adminRouter);

mongoose
  .connect(process.env.DATABASE, {
    dbName: "ALL4ONE_CARE_SERVICE",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected Successfully.");
  })
  .catch((err) => console.log(err.message));

const httpServer = http.createServer(app);

httpServer.listen(PORT, () => {
  console.log(`Http Server is running on port ${PORT}`);
});

// Load SSL certificate and private key
// const privateKey = fs.readFileSync('./certs/_.all4onecareservices.co.uk_private_key.key', 'utf8');
// const certificate = fs.readFileSync('./certs/all4onecareservices.co.uk_ssl_certificate.pem', 'utf8');
// const ca = fs.readFileSync('/path/to/chainfile.crt', 'utf8'); // Optional: Certificate Authority chain file
// const credentials = {
//     key: privateKey,
//     cert: certificate,
//     ca: ca 
// };

// const httpsServer = https.createServer(credentials, app);

// const HTTPSPORT = 443;

// httpsServer.listen(HTTPSPORT, () => {
//   console.log(`Secure Server is running on port ${HTTPSPORT}`);
// });

module.exports = app;

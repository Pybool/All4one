const rateLimit = require("express-rate-limit");

// General limiter: 10 requests per 10 minutes per IP
const generalLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // limit each IP to 10 requests per window
  message: {
    status: false,
    message: "Too many requests, please try again later."
  }
});

// Stricter limiter for sensitive endpoints (like forms)
const formLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // only 5 form submissions in 5 minutes
  message: {
    status: false,
    message: "Too many submissions, please try again later."
  }
});

module.exports = { generalLimiter, formLimiter };
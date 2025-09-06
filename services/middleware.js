const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const auth = require("./auth");
const FormStatus = require("../models/formStatus");
dotenv.config();
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Expected format: "Bearer <token>"

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
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

async function isAdmin(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Expected format: "Bearer <token>"

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const secret = process.env.JWT_SECRET || "some secret";
    const decoded = jwt.verify(token, secret);
    // Attach decoded payload to request so other routes can use it
    req.user = decoded;
    console.log(decoded)
    const role = await auth.getAdminRole(decoded.userId);
    if (role === "ADMIN") {
      next();
    } else {
      throw new Error("User is not admin");
    }
  } catch (err) {
    console.error("Error verifying token:", err);
    return res.status(403).json({ message: "Invalid or expired token." });
  }
}


async function checkFormEnabled(formKey) {
  const form = await FormStatus.findOne({ formKey });
  return !form || form.enabled; // default true if not found
}


module.exports = {verifyToken, isAdmin, checkFormEnabled}
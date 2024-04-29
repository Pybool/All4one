const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const Account = require("../models/accounts.model");

dotenv.config();

function generateToken(payload) {
  const secret = process.env.JWT_SECRET || "some secret";;
  const options = {
    expiresIn: "1h",
  };
  return jwt.sign(payload, secret, options);
}

function decodeToken(token) {
  const secret = process.env.JWT_SECRET || "some secret";
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    console.error("Error decoding token:", err);
    return null;
  }
}

async function hashPassword(password) {
  const saltRounds = 10; // Adjust salt rounds as needed (higher for more security)
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

async function comparePassword(plainPassword, hashedPassword) {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch;
}

async function createAccount(req) {
  try {
    let data = req.body;
    data.password = await hashPassword(data.password);
    data.createdAt = new Date();
    console.log("data ==========> ", data);
    const user = await Account.create(data);
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    console.log("Error =========> ", error);
    return null;
  }
}

async function signIn(req) {
  try {
    const { email, password } = req.body;
    const user = await Account.findOne({ email: email });
    if (!user) {
      return { pageTitle: "login", token: null };
    }
    const isPass = await comparePassword(password, user.password);
    if (!isPass) {
      return { pageTitle: "login", token: null };
    }

    if(user.role !== 'ADMIN'){
        return { pageTitle: "login", token: null };
    }
    const token = generateToken({ userId: user._id.toString() });
    console.log("Token ", token);
    return { pageTitle: "login", token: token };
  } catch (error) {
    console.log(error);
    return { pageTitle: "login", token: null };
  }
}

module.exports = { generateToken, decodeToken, createAccount, signIn };

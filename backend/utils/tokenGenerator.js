const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Token = require("../models/tokenModel");

const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

exports.generateAccessToken = (id) => {
  let expiry = process.env.JWT_EXPIRES_IN;

  // Remove all extra whitespace and hidden characters
  expiry = expiry?.toString().trim().replace(/\r/g, "");
  console.log("expiry is : ", expiry);
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: expiry,
  });
};

exports.generateRefreshToken = (id) => {
  let expiry = process.env.REFRESH_TOKEN_EXPIRE;

  // Remove all extra whitespace and hidden characters
  expiry = expiry?.toString().trim().replace(/\r/g, "");
  return jwt.sign({ id }, process.env.JWT_SECRET_R, {
    expiresIn: expiry,
  });
};

console.log("SECRET KEY IS : ", process.env.JWT_SECRET);

signToken = async (id) => {
  try {
    console.log("ID IS : ", id);
    const user = await User.findById(id);
    console.log("user is : ", user);
    if (!user) {
      throw new appError("User not found", 404);
    }
    console.log("user checkeds");
    const accessToken = this.generateAccessToken(user._id);
    const refreshToken = this.generateRefreshToken(user._id);
    console.log("access token is : ", accessToken);
    console.log("refresh token is : ", refreshToken);
    return { accessToken, refreshToken };
  } catch (err) {
    console.log(err.message);
    throw new appError("Could not generate access and refresh tokens", 500);
  }
};

module.exports = signToken;

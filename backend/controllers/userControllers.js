const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const User = require("../models/userModel");
import cloudinary from "../helpers/cloudinary";

exports.updateProfile = catchAsync(async (req, res, next) => {
  const { profilePic } = req.body;

  const response = await cloudinary.uploader.upload(image);
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { profilePic: response.secure_url },
    { new: true, runValidators: true }
  );
});

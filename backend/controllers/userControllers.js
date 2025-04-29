const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const User = require("../models/userModel");
const cloudinary = require("../helpers/cloudinary");

exports.updateProfile = catchAsync(async (req, res, next) => {
  const { profilePic } = req.body;

  const response = await cloudinary.uploader.upload(profilePic);
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { profilePic: response.secure_url },
    { new: true, runValidators: true }
  );
  if (!user) {
    return next(new appError(`User's profile was not updated.`, 400));
  }

  res.status(200).json({
    message: "Profile updated successfully",
    status: 200,
    data: user,
  });
});

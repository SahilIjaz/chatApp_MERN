const Message = require("../models/messagesModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");

exports.getSideUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({ _id: { $ne: req.user._id } });

  res.status(200).json({
    message: "Users are.",
    status: 200,
    length: users.length,
    data: users,
  });
});

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

exports.getMessages = catchAsync(async (req, res, next) => {
  const { user } = req.params;
  const messages = await Message.find({
    $or: [
      {
        $and: [{ senderId: req.user._id }, { receiverId: user }],
      },
      { $and: [{ senderId: user }, { receiverId: req.user._id }] },
    ],
  });
  if (messages.length === 0) {
    return next(new appError("There are no messages against you.", 404));
  }
  res.status(200).json({
    message: "All messages against you found successfully.",
    status: 200,
    length: messages.length,
    data: messages,
  });
});

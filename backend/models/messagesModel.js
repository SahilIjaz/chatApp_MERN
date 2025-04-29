const mongoose = require("mongoose");

const messageModel = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

messageModel.pre(/^find/, function (next) {
  this.populate({
    path: "senderId",
  });
  this.populate({
    path: "receiverId",
  });
  next();
});

const Message = mongoose.model("Message", messageModel);
module.exports = Message;

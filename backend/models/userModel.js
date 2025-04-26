const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      validate: [validator.isEmail, "Provide correct email."],
      unique: true,
    },
    password: {
      type: String,
    },
    profilePic: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre(/^find/, function (next) {
  this.find({
    $and: [{ isDeleted: false }],
  });
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.checkPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;

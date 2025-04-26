const signInTokens = require("../utils/tokenGenerator");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const Token = require("../models/tokenModel");
const User = require("../models/userModel");

//signUp
exports.signUp = catchAsync(async (req, res, next) => {
  let user;
  const { email, password, profilePic, name } = req.body;
  if (!(email || password)) {
    return res.status(400).json({
      message: "Please provide account, email, password, confirmPassword.",
      status: 400,
    });
  }

  user = await User.findOne({
    email,
  });
  if (user) {
    return res.status(400).json({
      message: "User with this email already exists.",
      status: 400,
    });
  }

  console.log("BEFORE ROLE CHECKING .");
  user = await User.create({
    email,
    password,
    name,
    profilePic,
    confirmPassword: password,
  });

  console.log("USER CREATION PRIOR");
  if (!user) {
    return res.status(400).json({
      message: "User was not found.",
      status: 400,
    });
  }

  const otp = await otpGenerator(user);
  console.log("OTP IS : => ", otp);

  const expirationTime = Date.now() + 1 * 60 * 1000;
  user.otpExpiration = expirationTime;
  user.otp = otp;
  user.isActive = true;
  await user.save();
  //   const act = logInChecks(user);
  const newToken = await Token.create({
    person: user._id,
  });

  if (!newToken) {
    return res.status(400).json({
      message: "Token was nt created.",
      status: 400,
    });
  }
  console.log("BEFORE RESPONSE");
  res.status(200).json({
    message: "OTP sent to your email address.",
    status: 200,
    // act,
    user,
  });
});

// otpVerification
exports.otpVerification = catchAsync(async (req, res, next) => {
  console.log("API HIT FOR VERIFICATION");
  const { email, otp } = req.body;

  if (!(email && otp)) {
    return res.status(400).json({
      message: "Provide both email and the otp.",
      status: 400,
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: "User was found.",
      status: 404,
    });
  }

  const currentTime = Date.now();
  if (user.otpExpiration < currentTime) {
    return res.status(400).json({
      message: "OTP expired,request fr new one. ",
      status: 400,
    });
  }

  if (user.otp !== otp) {
    return next(new appError("Invalid OTP provided.", 400));
  }

  user.isVerified = true;
  await user.save();

  const { accessToken, refreshToken } = await signInTokens(user._id);

  const userToken = await Token.findOne({ person: user._id });
  if (!userToken) {
    return next(new appError("Token for this user does not exist.", 404));
  }

  userToken.accessToken = accessToken;
  userToken.refreshToken = refreshToken;
  await userToken.save();

  //   const act = logInChecks(user);
  res.status(200).json({
    message: "OTP verified and login successful.",
    status: 200,
    accessToken,
    refreshToken,
    // act,
    user,
  });
});

// logIn
exports.logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!(email || password)) {
    return next(new appError("Email, password, are required.", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(400).json({
      message: "User not found.",
      status: 400,
    });
  }
  const passwordCorrect = await user.checkPassword(password, user.password);
  console.log("PASSWORD IS ", passwordCorrect);
  if (!passwordCorrect) {
    return res.status(404).json({
      status: 404,
      message: "Incorrect password!",
    });
  }

  const { accessToken, refreshToken } = await signInTokens(user._id);
  //   const act = logInChecks(user);

  const existingToken = await Token.findOne({
    person: user._id,
  });

  if (!existingToken) {
    await Token.create({
      person: user._id,
      accessToken,
      refreshToken,
    });
  } else {
    existingToken.accessToken = accessToken;
    existingToken.refreshToken = refreshToken;
    await existingToken.save();
  }

  user.isActive = true;
  await user.save();

  res.status(200).json({
    message: `${user.role} logged in successfully.`,
    status: 200,
    accessToken,
    refreshToken,
    // act,
    user,
  });
});

// getRefreshToken
exports.getRefreshToken = catchAsync(async (req, res, next) => {
  const { deviceId, fcmToken } = req.body;
  const token = await Token.findOne({
    $and: [{ refreshToken: req.params.token }, { deviceId }, { fcmToken }],
  });

  if (!token) {
    return next(new appError("Refresh token not found.", 400));
  }

  const { accessToken, refreshToken } = await signInTokens(token.person._id);
  res.status(200).json({
    message: "Refresh token retrieved successfully",
    status: 200,
    accessToken,
    refreshToken,
  });
});

// resendOTP
exports.resendOTP = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  console.log("EMAIL IS : ", email);
  const user = await User.findOne({ email });

  if (!user) {
    return next(new appError("User not found!", 404));
  }

  if (user.otpExpiration > Date.now()) {
    return next(new appError("Please wait 60 seconds.", 400));
  }

  if (user.isVerified) {
    return next(new appError("Your email is already verified.", 400));
  }

  const otp = await otpGenerator({ email });
  user.otp = otp;
  user.otpExpiration = Date.now() + 1 * 60 * 1000;
  await user.save();
  //   const act = logInChecks(user);
  res.status(200).json({
    message: "OTP resent to your email address",
    status: 200,
    // act,
    user,
  });
});

// logOut
exports.logOut = catchAsync(async (req, res, next) => {
  const token = await Token.findOneAndDelete({
    $and: [
      // { deviceId: req.body.deviceId },
      { person: req.user._id },
    ],
  });

  if (!token) {
    return next(new appError("This user is already logged out.", 400));
  }

  req.user.isActive = false;
  await req.user.save();

  res.status(200).json({
    message: "User logged out successfully!",
    status: 200,
  });
});
// deleteUser
exports.deleteUser = catchAsync(async (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    return next(new appError("Password not provided!", 400));
  }

  const user = await User.findById(req.user._id).select("+password");
  const passwordCorrect = await user.checkPassword(password, user.password);

  if (!passwordCorrect) {
    return next(new appError("Incorrect password!", 404));
  }

  if (user.otpExpiration > Date.now()) {
    return next(new appError("Please wait 60 seconds.", 400));
  }

  const email = req.user.email;
  const otp = await otpGenerator({ email });
  user.otp = otp;
  user.otpExpiration = Date.now() + 1 * 60 * 1000;
  await user.save();

  res.status(200).json({
    message: "OTP sent to delete user.",
    status: 200,
  });
});

// deleteMe
exports.deleteMe = catchAsync(async (req, res, next) => {
  const { otp } = req.body;
  //   const status = req.query.status;

  if (!otp) {
    return next(new appError("OTP must be provided.", 400));
  }

  if (req.user.otpExpiration < Date.now()) {
    return next(new appError("OTP has expired.", 400));
  }

  if (req.user.otp !== otp) {
    return next(new appError("Invalid OTP provided.", 400));
  }

  req.user.isDeleted = true;
  req.user.isActive = false;
  await req.user.save();

  res.status(200).json({
    message: "Your account has been successfully deleted!",
    status: 200,
  });
});

// forgotPassword
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new appError("Email not provided.", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new appError("User with this email not found.", 404));
  }

  const currentTime = Date.now();
  if (user.lastOtpSentAt && currentTime - user.lastOtpSentAt < 60 * 1000) {
    return next(new appError("Please wait 60 seconds.", 400));
  }

  const otp = await otpGenerator({ email });
  user.otp = otp;
  user.otpExpiration = currentTime + 1 * 60 * 1000;
  user.lastOtpSentAt = currentTime;
  await user.save();

  res.status(200).json({
    message: "OTP sent to your email address",
    status: 200,
  });
});

// passwordVerification
exports.otpVerificationPAssword = catchAsync(async (req, res, next) => {
  console.log("API HT FOR VERIFICATION ");
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new appError("User with this email not found!", 404));
  }

  const checkingTime = Date.now();
  if (user.otpExpiration < checkingTime) {
    return next(
      new appError("OTP has expired. Please request a new one.", 400)
    );
  }

  if (user.otp !== otp) {
    return next(new appError("Incorrect OTP provided.", 400));
  }

  if (user.otp === otp) {
    user.isVerified = true;
    await user.save();
  }

  user.otp = undefined;
  user.otpExpiration = undefined;
  await user.save();

  res.status(200).json({
    message: "Email successfully verified!",
    status: 200,
    user,
  });
});

//resetPassword
exports.resetPassword = catchAsync(async (req, res, next) => {
  const { newPassword, email } = req.body;

  if (!newPassword) {
    return next(
      new appError("Password and confirm password must be provided.", 400)
    );
  }

  const user = await User.findOne({ email });
  user.password = newPassword;
  user.confirmPassword = newPassword;
  await user.save();

  res.status(200).json({
    message: "Password changed successfully!",
    status: 200,
    user,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return next(new appError("Log in in order to get Access!", 401));
    }

    const decoded = await util.promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );
    console.log("Decoded Token: ", decoded);

    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      return next(new appError("This user no longer exists.", 401));
    }

    req.user = freshUser;
    next();
  } else {
    return next(new appError("Authorization header missing or invalid.", 401));
  }
});

exports.changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, email, newPassword } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new appError("User not found.", 404));
  }

  const passwordCorrect = await user.checkPassword(
    currentPassword,
    user.password
  );
  if (!passwordCorrect) {
    return next(new appError("Incorrect current password.", 400));
  }
  user.password = newPassword;
  user.confirmPassword = newPassword;
  await user.save();

  res.status(200).json({
    message: "Password changed successfully.",
    status: 200,
    user,
  });
});

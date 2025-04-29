const authControllers = require("../controllers/authControllers");
const express = require("express");
const router = express.Router();

router.route("/sign-up").post(authControllers.signUp);

router.route("/otp-verification").post(authControllers.otpVerification);

router.route("/re-send-otp").post(authControllers.resendOTP);

router.route("/log-in").post(authControllers.logIn);

router.route("/forgot-password").post(authControllers.forgotPassword);

router
  .route("/forgot-otp-verification")
  .post(authControllers.otpVerificationPAssword);

router.route("/change-password").post(authControllers.changePassword);

router.route("/delete-user").post(authControllers.deleteUser);

router.route("/delete-me").post(authControllers.deleteMe);

router.route("/log-out").get(authControllers.protect, authControllers.logOut);

router
  .route("/check-auth")
  .get(authControllers.protect, authControllers.checkAuth);

module.exports = router;

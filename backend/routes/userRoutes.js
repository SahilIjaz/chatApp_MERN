const userControllers = require("../controllers/userControllers");
const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/authControllers");

router
  .route("/update-profile")
  .patch(authControllers.protect, userControllers.updateProfile);

module.exports = router;

const express = require("express");
const router = express.Router();
const messageControllers = require("../controllers/messageControllers");
const authControllers = require("../controllers/authControllers");
router
  .route("/side-users")
  .get(authControllers.protect, messageControllers.getSideUsers);
module.exports = router;

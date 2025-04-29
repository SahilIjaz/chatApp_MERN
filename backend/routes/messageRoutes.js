const express = require("express");
const router = express.Router();
const messageControllers = require("../controllers/messageControllers");
const authControllers = require("../controllers/authControllers");
router
  .route("/side-users")
  .get(authControllers.protect, messageControllers.getSideUsers);

router
  .route("/all-messages/:user")
  .get(authControllers.protect, messageControllers.getMessages);
module.exports = router;

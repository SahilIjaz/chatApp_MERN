const express = require("express");
const router = express.Router();
const messageControllers = require("../controllers/messageControllers");
router.route("/side-users").get(messageControllers.getSideUsers);
module.exports = router;

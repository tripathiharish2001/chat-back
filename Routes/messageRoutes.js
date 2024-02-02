const express = require("express");
const {
  allMessages,
  sendMessage,
} = require("../Controllers/messageControllers");
const { protect } = require("../Middlewares/authMiddleware");

const router = express.Router();

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);

module.exports = router;

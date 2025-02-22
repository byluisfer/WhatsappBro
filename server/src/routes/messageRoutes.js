const express = require("express");
const {
  saveMessage,
  getMessages,
  getConversation,
} = require("../controllers/messageController");
const router = express.Router();

router.post("/send", saveMessage);
router.get("/all", getMessages);
router.get("/conversation", getConversation);

module.exports = router;

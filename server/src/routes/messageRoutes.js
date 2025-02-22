const express = require("express");
const {
  saveMessage,
  getMessages,
} = require("../controllers/messageController");
const router = express.Router();

router.post("/send", saveMessage);
router.get("/all", getMessages);

module.exports = router;

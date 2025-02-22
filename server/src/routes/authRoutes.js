const express = require("express");
const {
  register,
  login,
  addContact,
  getContacts,
} = require("../controllers/authController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/contacts/add", addContact);
router.get("/contacts", getContacts);

module.exports = router;

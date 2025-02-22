const express = require("express");
const {
  register,
  login,
  addContact,
  getContacts,
  updateProfile,
} = require("../controllers/authController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/contacts/add", addContact);
router.get("/contacts", getContacts);
router.post("/update-profile", updateProfile);

module.exports = router;

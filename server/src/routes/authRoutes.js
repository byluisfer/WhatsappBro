const express = require('express');
const {
  register,
  login,
  addContact,
} = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/contacts/add', addContact);

module.exports = router;

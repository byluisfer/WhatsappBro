const pool = require('../db/database');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'supersecret123';

exports.register = async (req, res) => {
  // Get the username, email and password from the request
  const { username, email, password } = req.body;
  try {
    // Conselt to the db and save in a variable "result"
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, password]
    );
    res.status(201).json({
      message: 'User registered successfully',
      userId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  // Get the email and password from the request
  const { email, password } = req.body;
  try {
    // Consult to the db and save in a variable "rows"
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [
      email,
    ]);
    // If the user does not exist or the password is incorrect, return an error
    if (rows.length === 0 || rows[0].password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = rows[0];
    // Create a token
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: '1h',
    });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addContact = async (req, res) => {
  // Get the username from the request
  const { username } = req.body;
  try {
    // Consult to the db and save in a variable "rows"
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [
      username,
    ]);
    // If the user does not exist, return an error
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = rows[0];
    res.status(200).json({
      contact: {
        id: user.id,
        name: user.username,
        message: 'New contact added!',
        avatar: '/Default_Profile.webp',
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error adding contact: ' + error.message });
  }
};

const express = require('express');
const cors = require('cors');
const pool = require('./db/database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Test route to see if its work nice -_-
app.get('/ping', (req, res) => {
  res.send('<h1>Pong</h1>');
});

app.post('/register', async (req, res) => {
  // Get the username, email and password from the request
  const { username, email, password } = req.body;
  try {
    // Conselt to the db and save in a variable "result"
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, password]
    );
    res.status(201).json({
      message: 'User successfully register!',
      userId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error to register user: ' + error.message });
  }
});

app.post('/login', async (req, res) => {
  // Get the email and password from the request
  const { email, password } = req.body;

  try {
    // Consult to the db and save in a variable "rows"
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [
      email,
    ]);

    // Check if the user exists
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Usuario not found' });
    }

    // Verify the password
    const user = rows[0];
    if (user.password !== password) {
      return res.status(401).json({ error: 'Wrong password' });
    }

    res.status(200).json({ message: 'Login successfully ', userId: user.id });
  } catch (error) {
    res.status(500).json({ error: 'Error to login: ' + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

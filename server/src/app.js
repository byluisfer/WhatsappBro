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
  const { username, email, password } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, password]
    );
    res.status(201).json({
      message: 'User right register!',
      userId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error to register user: ' + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

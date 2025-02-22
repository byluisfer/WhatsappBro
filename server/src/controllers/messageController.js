const pool = require("../db/database");

exports.saveMessage = async (req, res) => {
  const { senderId, text } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO messages (sender_id, text) VALUES (?, ?)",
      [senderId, text]
    );
    res
      .status(201)
      .json({ message: "Message saved", messageId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const [messages] = await pool.query(
      "SELECT * FROM messages ORDER BY id ASC"
    );
    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

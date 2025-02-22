const pool = require("../db/database");

exports.saveMessage = async (req, res) => {
  const { senderId, receiverId, text } = req.body;

  if (!senderId || !receiverId || !text) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO messages (sender_id, receiver_id, text) VALUES (?, ?, ?)",
      [senderId, receiverId, text]
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

exports.getConversation = async (req, res) => {
  const { senderId, receiverId } = req.query; // Get IDs from the URL

  if (!senderId || !receiverId) {
    return res.status(400).json({ error: "Missing senderId or receiverId" });
  }

  try {
    const [messages] = await pool.query(
      `SELECT * FROM messages 
       WHERE (sender_id = ? AND receiver_id = ?) 
       OR (sender_id = ? AND receiver_id = ?) 
       ORDER BY timestamp ASC`,
      [senderId, receiverId, receiverId, senderId] // Allows to view the chat in both directions
    );

    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

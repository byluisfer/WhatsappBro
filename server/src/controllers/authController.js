const pool = require("../db/database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const SECRET_KEY = "supersecret123";

exports.register = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body; // Recive the data from the request
  const defaultProfileImage = "Default_Profile.webp";

  try {
    // Check if the passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match!" });
    }

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (username, email, password, profileImage) VALUES (?, ?, ?, ?)",
      [username, email, hashedPassword, defaultProfileImage]
    );

    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = rows[0];

    // Compare the encrypted password with the one in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        profileImage: user.profileImage,
      },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addContact = async (req, res) => {
  const { username } = req.body;
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.id;

    const [contactRows] = await pool.query(
      "SELECT id, username, profileImage, is_online FROM users WHERE username = ?",
      [username]
    );

    if (contactRows.length === 0)
      return res.status(404).json({ error: "User not found" });

    const contactId = contactRows[0].id;

    if (userId === contactId)
      return res
        .status(400)
        .json({ error: "Cannot add yourself as a contact" });

    await pool.query(
      "INSERT INTO contacts (user_id, contact_id) VALUES (?, ?)",
      [userId, contactId]
    );

    res.status(200).json({
      contact: {
        id: contactId,
        name: contactRows[0].username,
        avatar: contactRows[0].profileImage,
        message: contactRows[0].is_online ? "🟢 Online" : "⚪ Offline",
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding contact: " + error.message });
  }
};

exports.getContacts = async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Obtener el token

  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.id; // ID del usuario

    const [contacts] = await pool.query(
      `SELECT users.id, users.username, users.email, users.profileImage, users.is_online 
      FROM contacts JOIN users 
      ON contacts.contact_id = users.id 
      WHERE contacts.user_id = ?;`,
      [userId]
    );

    res.status(200).json({ contacts });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching contacts: " + error.message });
  }
};

exports.updateProfile = async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.id;

    let { username } = req.body;

    if (!username || username.trim() === "") {
      const [user] = await pool.query(
        "SELECT username FROM users WHERE id = ?",
        [userId]
      );
      username = user[0].username;
    }

    // Update the username in the database
    await pool.query("UPDATE users SET username = ? WHERE id = ?", [
      username,
      userId,
    ]);

    // Create a new token with the new username
    const newToken = jwt.sign(
      {
        id: userId,
        email: decoded.email,
        username, // New username
        profileImage: decoded.profileImage,
      },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      message: "Profile updated successfully",
      token: newToken, // Send the new token
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating profile: " + error.message });
  }
};

exports.setOnlineStatus = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "The body is empty" });
  }

  const { userId, is_online } = req.body;

  if (userId === undefined || is_online === undefined) {
    return res.status(400).json({ error: "Missing userId or is_online field" });
  }

  try {
    const [result] = await pool.query(
      "UPDATE users SET is_online = ? WHERE id = ?",
      [is_online ? 1 : 0, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: `User ${userId} is now ${is_online ? "online" : "offline"}`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const pool = require("../db/database");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "supersecret123";

exports.register = async (req, res) => {
  // Get the username, email and password from the request
  const { username, email, password } = req.body;
  const defaultProfileImage = "Default_Profile.webp";
  try {
    // Conselt to the db and save in a variable "result"
    const [result] = await pool.query(
      "INSERT INTO users (username, email, password, profileImage) VALUES (?, ?, ?, ?)",
      [username, email, password, defaultProfileImage]
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
  // Get the email and password from the request
  const { email, password } = req.body;
  try {
    // Consult to the db and save in a variable "rows"
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    // If the user does not exist or the password is incorrect, return an error
    if (rows.length === 0 || rows[0].password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const user = rows[0];
    // Create a token
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

    let { username, profilePic } = req.body;

    if (!username || username.trim() === "") {
      const [user] = await pool.query(
        "SELECT username FROM users WHERE id = ?",
        [userId]
      );
      username = user[0].username;
    }

    let query = "UPDATE users SET username = ? WHERE id = ?";
    let params = [username, userId];

    if (profilePic) {
      query = "UPDATE users SET username = ?, profileImage = ? WHERE id = ?";
      params = [username, profilePic, userId];
    }

    await pool.query(query, params);

    res.status(200).json({
      message: "Profile updated successfully",
      profileImage: profilePic,
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

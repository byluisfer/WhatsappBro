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
  // Get the username from the request
  const { username } = req.body;
  const token = req.headers["authorization"]?.split(" ")[1]; // Get the token from the headers

  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Decode the token
    const userId = decoded.id; // Get the userId from the decoded token

    // Get the userId from the username
    const [contactRows] = await pool.query(
      "SELECT * FROM users WHERE username = ?",
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
        message: "New contact added!",
        avatar: contactRows[0].profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding contact: " + error.message });
  }
};

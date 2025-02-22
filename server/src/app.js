const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const { createServer } = require("http");
const { Server } = require("socket.io");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
const PORT = 3000;

const server = createServer(app); // Create HTTP server
const io = new Server(server, {
  // Initialize Socket.io in the server
  cors: {
    origin: "*", // Allow all conexions
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

app.get("/ping", (req, res) => res.send("<h1>Pong</h1>"));
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// https://socket.io/docs/v4/server-initialization/
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("sendMessage", async (data) => {
    console.log("Message received:", data);
    io.emit("receiveMessage", data);
    try {
      await pool.query("INSERT INTO messages (sender_id, text) VALUES (?, ?)", [
        data.senderId,
        data.text,
      ]);
    } catch (error) {
      console.error("Database error:", error);
    }
  });
});

server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

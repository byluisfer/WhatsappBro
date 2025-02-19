const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = 3000;

const server = createServer(app); // Create HTTP server
const io = new Server(server, {
  // Initialize Socket.io in the server
  cors: {
    origin: '*', // Allow all conexions
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

app.get('/ping', (req, res) => res.send('<h1>Pong</h1>'));
app.use('/api/auth', authRoutes);

// https://socket.io/docs/v4/server-initialization/
io.on('connection', (socket) => {
  console.log('Usur conected:', socket.id);

  // Message events from the client
  socket.on('sendMessage', (data) => {
    console.log('Message recived:', data);
    io.emit('receiveMessage', data); // Send message to all
  });

  socket.on('disconnect', () => {
    console.log('User disconected:', socket.id);
  });
});

server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

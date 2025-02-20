import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Connect to the server

const ChatArea = () => {
  const [messages, setMessages] = useState([]); // Save the messages and update when a new message is received (start empty)
  const [input, setInput] = useState(''); // Save the input text and update when the user types (start empty)

  // Listen for new messages
  useEffect(() => {
    socket.on('receiveMessage', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]); // Add new message to the array
    });

    return () => socket.off('receiveMessage'); // Clean up
  }, []);

  // To send message
  const handleSend = () => {
    if (input.trim()) {
      const newMessage = { text: input, sender: 'Me' };
      socket.emit('sendMessage', newMessage);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-30px)] p-4 bg-white/15 backdrop-blur-3xl rounded-3xl shadow-lg border border-white/20">
      <div className="flex-1 overflow-y-auto p-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${msg.sender === 'Me' ? 'text-right' : 'text-left'}`}
          >
            <span className="inline-block bg-teal-600 text-white p-2 rounded-xl shadow-md">
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center p-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          className="flex-1 p-2 rounded-xl bg-white/30 border border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          onClick={handleSend}
          className="ml-2 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 cursor-pointer transition shadow-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatArea;

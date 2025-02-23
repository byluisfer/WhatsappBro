import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

const ChatArea = ({ selectedContact, userId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!selectedContact) return; // If no contact is selected, don't fetch messages.

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/messages/conversation?senderId=${userId}&receiverId=${selectedContact.id}`
        );
        const data = await response.json();

        // Convert sender_id to senderID to match the prop type
        const formattedMessages = data.messages.map((msg) => ({
          id: msg.id,
          senderId: msg.sender_id, //  Convert sender_id to senderID
          receiverId: msg.receiver_id,
          text: msg.text,
          timestamp: msg.timestamp,
        }));

        setMessages(formattedMessages); // Save only the messages from this conversation
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    socket.on('receiveMessage', (data) => {
      if (
        (data.senderId === userId && data.receiverId === selectedContact.id) ||
        (data.senderId === selectedContact.id && data.receiverId === userId)
      ) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [selectedContact, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!selectedContact || !userId) {
      console.error('No contact selected or userId is missing.');
      return;
    }

    if (input.trim()) {
      const newMessage = {
        senderId: userId,
        receiverId: selectedContact.id,
        text: input,
      };

      socket.emit('sendMessage', newMessage);

      fetch('http://localhost:3000/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMessage),
      });

      setInput('');
    }
  };

  // To just press Enter to send the message ;)
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Avoid the form from submitting
      handleSend(); //  Send the message
    }
  };

  return (
    <div className="flex flex-col h-full p-4 bg-white/15 rounded-3xl shadow-lg border border-white/20">
      {/* 🔥 Mensajes con altura fija y scroll */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 max-h-[660px]">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${msg.senderId === userId ? 'items-end' : 'items-start'}`}
          >
            <span
              className={`p-3 rounded-xl text-white max-w-xs break-all overflow-wrap anywhere ${
                msg.senderId === userId ? 'bg-teal-600' : 'bg-gray-600'
              }`}
            >
              {msg.text}
            </span>
            <span className="text-xs text-gray-400 mt-1">
              {msg.senderId === userId ? 'Me' : selectedContact.name}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center p-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
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

import React from 'react';

const ContactList = ({ contacts, userId, onSelectContact }) => {
  if (contacts.length === 0) {
    return null; // 🔹 No renderiza nada si no hay contactos
  }

  return (
    <div className="fixed top-36 left-5 p-2 min-w-md bg-white/20 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20">
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className="flex items-center p-4 mb-2 cursor-pointer"
          onClick={() => onSelectContact(contact)}
        >
          <div className="flex items-center justify-center text-xl font-bold rounded-full">
            <img
              src={`/${contact.avatar}`}
              alt={contact.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-white font-bold text-lg">{contact.name}</h3>
            <p className="text-gray-300 text-sm">
              {contact.isOnline ? '🟢 Online' : '⚪ Offline'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;

import React, { useState } from 'react';
import ProfilePanel from './components/ProfilePanel';
import ContactList from './components/ContactList';
import ChatArea from './components/ChatArea';

function App() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);

  // To add a contact
  const handleAddContact = (newContact) => {
    setContacts((prevContacts) => [...prevContacts, newContact]); // Add the new contact to the list
  };

  // To see the chat from the selected contact
  const handleSelectContact = (contact) => {
    setSelectedContact(contact); // Save the selected contact
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-900 to-gray-900 flex">
      <div className="w-2/6">
        <ProfilePanel onAddContact={handleAddContact} />
        <ContactList
          contacts={contacts}
          onSelectContact={handleSelectContact}
        />
      </div>
      <div className="flex-1 p-4">{selectedContact && <ChatArea />}</div>
    </div>
  );
}

export default App;

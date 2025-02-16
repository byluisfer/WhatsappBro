import React, { useState } from 'react';
import ProfilePanel from './components/ProfilePanel';
import ContactList from './components/ContactList';

function App() {
  // useState([] is an array that holds the contacts with not data at first
  const [contacts, setContacts] = useState([]);

  // Function to add a new contact to the contacts array
  const handleAddContact = (newContact) => {
    // Use the spread operator to add the new contact to the existing array
    setContacts((prevContacts) => [...prevContacts, newContact]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-900 to-gray-900 flex">
      <ProfilePanel onAddContact={handleAddContact} />
      <ContactList contacts={contacts} />
    </div>
  );
}

export default App;

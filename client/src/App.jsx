import React, { useState, useEffect } from 'react';
import ProfilePanel from './components/ProfilePanel';
import ContactList from './components/ContactList';
import ChatArea from './components/ChatArea';

function App() {
  const [contacts, setContacts] = useState([]); // Save the contacts and start with an empty array
  const [selectedContact, setSelectedContact] = useState(null); // Save the selected contact

  useEffect(() => {
    const fetchContacts = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch(
          'http://localhost:3000/api/auth/contacts',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        if (response.ok) {
          const formattedContacts = data.contacts.map((contact) => ({
            id: contact.id, // Use the id as the key
            name: contact.username, //  Use the username as the name
            avatar: contact.profileImage || 'Default_Profile.webp', //  Default image
            message: 'New contact added!', // Default message
          }));
          setContacts(formattedContacts); // Save the contacts in the state
        } else {
          console.error('Error fetching contacts:', data.error);
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    fetchContacts();
  }, []);

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

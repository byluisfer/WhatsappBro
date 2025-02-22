import React, { useState, useEffect } from 'react';
import ProfilePanel from './components/ProfilePanel';
import ContactList from './components/ContactList';
import ChatArea from './components/ChatArea';
import SettingsPanel from './components/SettingsPanel';
import { jwtDecode } from 'jwt-decode';

function App() {
  const [contacts, setContacts] = useState([]); // Save the contacts and start with an empty array
  const [selectedContact, setSelectedContact] = useState(null); // Save the selected contact
  const [showSettings, setShowSettings] = useState(false); // Show the settings panel
  const [userId, setUserId] = useState(null); // Save the userId

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      setUserId(decoded.id); // Save the userId
    } catch (error) {
      console.error('Error decoding token:', error);
    }

    const fetchContacts = async () => {
      try {
        const response = await fetch(
          'http://localhost:3000/api/auth/contacts',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setContacts(
            data.contacts.map((contact) => ({
              id: contact.id,
              name: contact.username,
              avatar: contact.profileImage || 'Default_Profile.webp',
              message: 'New contact added!',
            }))
          );
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
    alert(`Abierto chat con ${contact.name}`); // Show a message to the user
    setSelectedContact(contact); // Save the selected contact
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-900 to-gray-900 flex">
      <div className="w-2/6">
        <ProfilePanel
          onAddContact={handleAddContact}
          setShowSettings={setShowSettings}
        />
        <ContactList
          contacts={contacts}
          onSelectContact={handleSelectContact}
        />
      </div>
      <div className="flex-1 p-4">
        {showSettings ? (
          <SettingsPanel setShowSettings={setShowSettings} />
        ) : selectedContact && userId ? (
          <ChatArea selectedContact={selectedContact} userId={userId} />
        ) : null}
      </div>
    </div>
  );
}

export default App;

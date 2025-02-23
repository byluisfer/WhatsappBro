import React, { useState, useEffect } from 'react';
import ProfilePanel from './components/ProfilePanel';
import ContactList from './components/ContactList';
import ChatArea from './components/ChatArea';
import SettingsPanel from './components/SettingsPanel';
import { jwtDecode } from 'jwt-decode';

function App() {
  const [user, setUser] = useState({
    username: '',
    email: '',
    profilePic: 'Default_Profile.webp',
  });
  const [contacts, setContacts] = useState([]); // Save the contacts and start with an empty array
  const [selectedContact, setSelectedContact] = useState(null); // Save the selected contact
  const [showSettings, setShowSettings] = useState(false); // Show the settings panel
  const [userId, setUserId] = useState(null); // Save the userId

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          username: decoded.username,
          email: decoded.email,
          profilePic: decoded.profileImage,
          userId: decoded.id,
        });
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
      }
    } else {
      setUserId(null);
    }

    const fetchContacts = async () => {
      try {
        const response = await fetch(
          'http://localhost:3000/api/auth/contacts',
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        const data = await response.json();
        if (response.ok) {
          setContacts(
            data.contacts.map((contact) => ({
              id: contact.id,
              name: contact.username,
              avatar: contact.profileImage || 'Default_Profile.webp',
              isOnline: contact.is_online,
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
    setSelectedContact(contact); // Save the selected contact
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-900 to-gray-900 flex">
      <div className="w-2/6">
        <ProfilePanel
          user={user}
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
          <SettingsPanel setShowSettings={setShowSettings} setUser={setUser} />
        ) : selectedContact && user.userId ? (
          <ChatArea selectedContact={selectedContact} userId={user.userId} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <img src="/Logo.webp" alt="Chat Icon" className="w-24 h-24 mb-4" />
            <p className="text-gray-400 text-2xl text-center">
              Select a contact to chat
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

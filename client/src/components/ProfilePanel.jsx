import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import PlusIcon from '/Add_Contact.svg';
import SettingsIcon from '/Settings.svg';
import { jwtDecode } from 'jwt-decode';

const ProfilePanel = ({ onAddContact }) => {
  // Set the initial state of the user
  const [user, setUser] = useState({
    username: '',
    email: '',
    profilePic: 'Default_Profile.webp', // Default profile image
  });

  const [showPopup, setShowPopup] = useState(false); // Show the popup to add a new contact (start with false)
  const [username, setUsername] = useState(''); // Save the username to add (start empty)

  // UseEffect to get the user info from the token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token); // Decode the token
      setUser({
        username: decoded.username,
        email: decoded.email,
        profilePic: decoded.profileImage,
      });
    }
  }, []);

  // Show the popup to add a new contact
  const handleAddClick = () => setShowPopup(true);

  // Close the popup
  const closePopup = () => {
    setShowPopup(false);
    setUsername('');
  };

  const handleAddContact = async () => {
    if (!username.trim()) return alert('Username cannot be empty');

    try {
      const response = await fetch(
        `http://localhost:3000/api/auth/contacts/add`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ username }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        const formattedContact = {
          id: data.contact.id,
          name: data.contact.name,
          avatar: data.contact.avatar || 'Default_Profile.webp', //  Default image
          message: 'New contact added!', //  Default message
        };

        onAddContact(formattedContact);
        closePopup();
      } else {
        alert(data.error || 'Failed to add contact');
      }
    } catch (error) {
      console.error('Error adding contact:', error);
      alert('An error occurred when adding the contact');
    }
  };

  return (
    <>
      <div className="fixed top-4 left-4 bg-white/20 backdrop-blur-xl rounded-full p-4 flex items-center space-x-4 shadow-lg border border-white/20 min-w-md">
        <img
          src={`/${user.profilePic}`} // Use the profilePic prop from the user object
          alt="Profile"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="text-white font-semibold text-lg">
            {user.username}
          </span>
          <span className="text-gray-300 text-sm">{user.email}</span>
        </div>
        <div className="flex items-center space-x-2 ml-auto">
          <img
            src={PlusIcon}
            alt="Add"
            className="w-6 h-6 cursor-pointer"
            onClick={handleAddClick}
          />
          <img
            src={SettingsIcon}
            alt="Settings"
            className="w-6 h-6 cursor-pointer"
          />
        </div>
      </div>

      {showPopup &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-80 max-w-sm">
              <h2 className="text-lg font-semibold mb-4 text-center">
                Add New Contact
              </h2>
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={closePopup}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddContact}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default ProfilePanel;

import React, { useState } from 'react';

const SettingsPanel = ({ setShowSettings, setUser }) => {
  const [username, setUsername] = useState(''); // Save the username to update

  const handleSave = async () => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      alert('No token found.');
      return;
    }

    const decodedToken = JSON.parse(atob(storedToken.split('.')[1])); // Decode the token
    const currentUsername = decodedToken.username || ''; // Get the current username

    const finalUsername = username.trim() !== '' ? username : currentUsername; // Use the username or the current username

    if (!finalUsername) {
      alert('Username cannot be empty!');
      return;
    }

    sendProfileUpdate(finalUsername); // Send the update
  };

  // Send the profile update
  const sendProfileUpdate = async (username, profilePic) => {
    try {
      const response = await fetch(
        'http://localhost:3000/api/auth/update-profile',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ username, profilePic }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert('Profile updated successfully!');
        setUser((prevUser) => ({
          ...prevUser,
          username, // Update the username
        }));
        setShowSettings(false);
      } else {
        alert(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="h-full p-6 bg-white/15 backdrop-blur-3xl rounded-3xl shadow-lg border border-white/20">
      <h2 className="text-2xl text-white font-semibold mb-4">Settings</h2>

      <input
        type="text"
        placeholder="New Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 mb-4 border text-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
      />

      <div className="flex justify-between">
        <button
          onClick={() => setShowSettings(false)}
          className="px-4 py-2 bg-gray-500 text-white rounded-xl cursor-pointer hover:bg-gray-600"
        >
          Back
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-teal-600 text-white rounded-xl cursor-pointer hover:bg-teal-700"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;

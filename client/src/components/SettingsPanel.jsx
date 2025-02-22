import React, { useState } from 'react';

const SettingsPanel = ({ setShowSettings }) => {
  const [username, setUsername] = useState(''); // Save the username to update
  const [profilePic, setProfilePic] = useState(null); // Save the profilePic to update

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

    let profilePicBase64 = null; // Save the base64 of the profilePic
    // When there is a profilePic, we convert it to base64
    if (profilePic) {
      const reader = new FileReader();
      reader.readAsDataURL(profilePic);
      reader.onloadend = async () => {
        profilePicBase64 = reader.result; // Convert the profilePic to base64
        sendProfileUpdate(finalUsername, profilePicBase64);
      };
      return;
    }

    sendProfileUpdate(finalUsername, profilePicBase64); // Send the update
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
          body: JSON.stringify({ username, profilePic }), // Send the username and profilePic
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert('Profile updated successfully!');
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

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setProfilePic(e.target.files[0])}
        className="w-full p-2 mb-4 border-gray-500 text-gray-500 border rounded-lg"
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

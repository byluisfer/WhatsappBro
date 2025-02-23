import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

const SettingsPanel = ({ setShowSettings, setUser }) => {
  const [username, setUsername] = useState(''); // Save the username to update
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleSave = async () => {
    const storedToken = localStorage.getItem('token');

    const decodedToken = JSON.parse(atob(storedToken.split('.')[1])); // Decode the token
    const currentUsername = decodedToken.username || ''; // Get the current username

    // Verify that the username is not empty or same as the current one
    if (!username.trim()) {
      enqueueSnackbar('Please enter a new username before saving.', {
        variant: 'warning',
      });
      return;
    }

    if (username === currentUsername) {
      enqueueSnackbar('New username must be different from the current one.', {
        variant: 'warning',
      });
      return;
    }

    sendProfileUpdate(username); // Send the update
  };

  // Send the profile update
  const sendProfileUpdate = async (username) => {
    try {
      const response = await fetch(
        'http://localhost:3000/api/auth/update-profile',
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
        enqueueSnackbar('Profile updated successfully!', {
          variant: 'success',
        });

        // Save the new token if it exists
        if (data.token) {
          localStorage.setItem('token', data.token);
        }

        setUser((prevUser) => ({
          ...prevUser,
          username, // Update the username in the state
        }));

        setShowSettings(false);
      } else {
        enqueueSnackbar(data.error || 'Failed to update profile', {
          variant: 'error',
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    enqueueSnackbar('Logged out successfully!', { variant: 'info' });
    navigate('/login');
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

      <div className="flex justify-between w-full mt-4">
        <button
          onClick={() => setShowSettings(false)}
          className="px-6 py-2 bg-gray-500 text-white rounded-xl cursor-pointer hover:bg-gray-600 flex-1 mx-2"
        >
          Back
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-teal-600 text-white rounded-xl cursor-pointer hover:bg-teal-700 flex-1 mx-2"
        >
          Save
        </button>
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-600 text-white rounded-xl cursor-pointer hover:bg-red-700 flex-1 mx-2"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;

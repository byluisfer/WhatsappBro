import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import profilePic from '/Profile_Photo1.webp';
import PlusIcon from '/Add_Contact.svg';
import SettingsIcon from '/Settings.svg';

const ProfilePanel = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleAddClick = () => setShowPopup(true);
  const closePopup = () => setShowPopup(false);

  return (
    <>
      <div className="fixed top-4 left-4 bg-white/20 backdrop-blur-xl rounded-full p-4 flex items-center space-x-4 shadow-lg border border-white/20 min-w-md">
        <img
          src={profilePic}
          alt="Profile"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="text-white font-semibold text-lg">AncaraPessi</span>
          <span className="text-gray-300 text-sm">messimalo@gmail.com</span>
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
                Add new contact
              </h2>
              <input
                type="text"
                placeholder="Enter username"
                className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={closePopup}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition cursor-pointer">
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

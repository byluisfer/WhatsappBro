import React from 'react';
import profilePic from '/Profile_Photo1.webp';
import PlusIcon from '/Add_Contact.svg';
import SettingsIcon from '/Settings.svg';

const ProfilePanel = () => {
  return (
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
        <img src={PlusIcon} alt="Add" className="w-6 h-6 cursor-pointer" />
        <img
          src={SettingsIcon}
          alt="Settings"
          className="w-6 h-6 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default ProfilePanel;

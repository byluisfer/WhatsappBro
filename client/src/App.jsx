import React from 'react';
import './App.css';
import ProfilePanel from './components/ProfilePanel';
import ContactList from './components/ContactList';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-900 to-gray-900 flex">
      <div className="flex flex-col w-1/4">
        <ProfilePanel />
        <ContactList />
      </div>
    </div>
  );
}

export default App;

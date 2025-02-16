import React from 'react';
import './App.css';
import ProfilePanel from './components/ProfilePanel';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-900 to-gray-900 flex items-center justify-center">
      <ProfilePanel />
    </div>
  );
}

export default App;

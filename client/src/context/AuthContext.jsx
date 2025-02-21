import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create the context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // State of the token
  const [token, setToken] = useState(null);

  const navigate = useNavigate(); // Allows to redirect to new pages

  // Check if the token is stored in local storage to go login
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    // If the token is not stored in local storage, redirect to the login page
    if (!storedToken) {
      navigate('/register');
    } else {
      setToken(storedToken);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

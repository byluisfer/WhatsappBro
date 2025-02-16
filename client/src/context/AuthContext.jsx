import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Create the context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Get the token from local storage
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the token is stored in local storage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    // If the token is not stored in local storage, redirect to the login page
    if (!storedToken) {
      if (location.pathname !== '/login') {
        navigate('/register');
      }
    } else {
      setToken(storedToken);
    }
  }, [location.pathname]);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

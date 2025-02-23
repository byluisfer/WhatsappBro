import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Create the context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    if (!storedToken) {
      // If the token is not stored, redirect to the login page
      if (location.pathname !== '/login' && location.pathname !== '/register') {
        navigate('/login');
      }
    } else {
      setToken(storedToken);
    }
  }, [location.pathname]); // Execute the effect only when the pathname changes

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

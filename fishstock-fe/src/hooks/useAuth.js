import React, { useState, useEffect, useContext, createContext } from 'react';
import { checkAuth } from './checkAuth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ isAuth: false });

  useEffect(() => {
    checkAuth(setAuth);
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

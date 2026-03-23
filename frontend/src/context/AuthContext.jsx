import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('fyc_user');
    const token = localStorage.getItem('fyc_token');
    if (stored && token) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('fyc_token', data.token);
    localStorage.setItem('fyc_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password, phone) => {
    const { data } = await API.post('/auth/register', { name, email, password, phone });
    localStorage.setItem('fyc_token', data.token);
    localStorage.setItem('fyc_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('fyc_token');
    localStorage.removeItem('fyc_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

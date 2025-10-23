// src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decodedUser = jwtDecode(storedToken);
        const isExpired = decodedUser.exp * 1000 < Date.now();
        if (isExpired) {
          localStorage.removeItem('token');
        } else {
          setUser(decodedUser.user);
          setToken(storedToken);
        }
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    setLoading(true); // <-- ADICIONADO: Avisa que estamos começando a carregar
    try {
      const response = await api.post('/auth/login', { username, password });
      const receivedToken = response.data.token;
      localStorage.setItem('token', receivedToken);
      const decodedUser = jwtDecode(receivedToken);
      setUser(decodedUser.user);
      setToken(receivedToken);
      return decodedUser.user;
    } catch (error) {
      logout();
      return null;
    } finally {
      setLoading(false); // <-- ADICIONADO: Avisa que terminamos de carregar (com sucesso ou erro)
    }
  };

  const logout = () => { /* ... sua função de logout continua a mesma ... */ };
  
  const value = useMemo(() => ({
    token, user, loading, login, logout, isAuthenticated: !!token,
  }), [token, user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
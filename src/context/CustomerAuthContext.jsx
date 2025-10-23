// src/context/CustomerAuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/api';
import { jwtDecode } from 'jwt-decode';

const CustomerAuthContext = createContext(null);

export const CustomerAuthProvider = ({ children }) => {
  const [customerToken, setCustomerToken] = useState(localStorage.getItem('customerToken'));
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (customerToken) {
      try {
        const decoded = jwtDecode(customerToken);
        // Poderíamos adicionar uma verificação de expiração aqui
        setCustomer(decoded.customer);
        api.defaults.headers.common['x-customer-auth-token'] = customerToken; // Header separado
      } catch (error) {
        console.error("Token de cliente inválido:", error);
        localStorage.removeItem('customerToken');
        setCustomerToken(null);
        setCustomer(null);
      }
    }
    setLoading(false);
  }, [customerToken]);

  const customerLogin = (token) => {
    localStorage.setItem('customerToken', token);
    setCustomerToken(token);
  };

  const customerLogout = () => {
    localStorage.removeItem('customerToken');
    setCustomerToken(null);
    setCustomer(null);
    delete api.defaults.headers.common['x-customer-auth-token'];
  };

  const isAuthenticated = !!customerToken;

  return (
    <CustomerAuthContext.Provider value={{ customerToken, customer, isAuthenticated, customerLogin, customerLogout, loading }}>
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  return useContext(CustomerAuthContext);
};
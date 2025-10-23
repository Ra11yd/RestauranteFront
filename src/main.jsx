import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx';
import { CustomerAuthProvider } from './context/CustomerAuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <CustomerAuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </CustomerAuthProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>,
);

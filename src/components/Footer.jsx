// src/components/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="social-icons">
        {/* Estes links podem ser alterados ou removidos depois */}
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <i className="fab fa-instagram"></i>
        </a>
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
          <i className="fab fa-facebook-f"></i>
        </a>
      </div>

      {/* LINK DE LOGIN PARA O ADMIN */}
      <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--cor-borda-cinza)', paddingTop: '1.5rem' }}>
        <Link to="/login" style={{ color: 'var(--cor-texto-secundaria)', textDecoration: 'none', fontSize: '0.9rem' }}>
          Acesso do Administrador
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
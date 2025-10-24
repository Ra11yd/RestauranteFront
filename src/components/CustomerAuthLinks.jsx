import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCustomerAuth } from '../context/CustomerAuthContext';

function CustomerAuthLinks() {
  const { isAuthenticated, customerLogout, customer } = useCustomerAuth();
  const { slug } = useParams();

  // Estilo para o botão "Entrar"
  const buttonStyle = {
    backgroundColor: 'var(--cor-secundaria-amarelo)',
    color: 'var(--cor-fundo-escuro)',
    textDecoration: 'none',
    padding: '0.75rem 1rem',
    borderRadius: '5px',
    fontWeight: 'bold',
    textAlign: 'center',
    display: 'block',
    width: '100%',
    fontSize: '1rem',
    border: 'none',
    cursor: 'pointer'
  };

  // Estilo para links quando logado
  const linkStyle = {
     color: 'var(--cor-secundaria-amarelo)',
     fontWeight: 'bold',
     textDecoration: 'none'
  };

  // --- Estado Logado ---
  if (isAuthenticated && customer) {
    return (
      <div className="customer-auth-links-cart" style={{textAlign: 'center', lineHeight: '1.5'}}>
        <span style={{display: 'block', marginBottom: '0.5rem', color: 'var(--cor-texto-claro)'}}>
          Logado como: <strong>{customer.name}</strong>
        </span>
        <div>
          <Link to="/meus-pedidos" style={linkStyle}>Meus Pedidos</Link>
          <button 
            onClick={customerLogout} 
            style={{
              marginLeft: '1rem', 
              background: 'none', 
              border: 'none', 
              color: 'var(--cor-primaria-vermelho)', 
              cursor: 'pointer', 
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}
          >
            (Sair)
          </button>
        </div>
      </div>
    );
  }

  // --- Estado Deslogado (Como solicitado) ---
  return (
    <div className="customer-auth-links-cart" style={{textAlign: 'center'}}>
      <p style={{fontSize: '0.9rem', color: 'var(--cor-texto-secundaria)', marginBottom: '0.75rem'}}>
        Já tem uma conta? Faça o login!
      </p>
      <Link to={`/login/${slug}`} style={buttonStyle}>
        Entrar
      </Link>
      <p style={{textAlign: 'center', fontSize: '0.8rem', color: 'var(--cor-texto-secundaria)', marginTop: '1rem'}}>
        Não tem conta? <Link to={`/cadastro/${slug}`} style={linkStyle}>Cadastre-se aqui</Link>
      </p>
    </div>
  );
}

export default CustomerAuthLinks;

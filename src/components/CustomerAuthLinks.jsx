import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCustomerAuth } from '../context/CustomerAuthContext';

function CustomerAuthLinks() {
  const { isAuthenticated, customerLogout, customer } = useCustomerAuth();
  const { slug } = useParams();

  if (isAuthenticated) {
    return (
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <span>Olá, {customer.name}!</span>
        <Link to="/meus-pedidos">Meus Pedidos</Link>
        <button onClick={customerLogout}>Sair</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Link to={`/login/${slug}`}>Entrar</Link>
      <Link to={`/cadastro/${slug}`}>Cadastrar</Link>
    </div>
  );
}

export default CustomerAuthLinks;
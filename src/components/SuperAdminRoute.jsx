    // src/components/SuperAdminRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function SuperAdminRoute() {
  // Pega os dados de autenticação do nosso "quadro de avisos"
  const { isAuthenticated, user, loading } = useAuth();

  // Se ainda estiver verificando a autenticação, mostra uma mensagem de carregamento
  if (loading) {
    return <div>Carregando...</div>;
  }

  // A lógica do segurança VIP:
  // Se o usuário está autenticado E a sua função é 'superadmin', permite o acesso.
  // Caso contrário, chuta o usuário para a página de login.
  return (isAuthenticated && user?.role === 'superadmin') 
    ? <Outlet /> 
    : <Navigate to="/login" replace />;
}

export default SuperAdminRoute;
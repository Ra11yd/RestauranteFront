// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  // ADICIONADO: Verificação de carregamento
  if (loading) {
    return <div>Carregando...</div>; 
  }

  // A lógica antiga continua
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
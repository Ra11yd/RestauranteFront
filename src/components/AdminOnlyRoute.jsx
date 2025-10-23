import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminOnlyRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>; // Ou um spinner
  }

  // Se não estiver carregando e o usuário for admin ou superadmin, permite o acesso
  return user && (user.role === 'admin' || user.role === 'superadmin') ? <Outlet /> : <Navigate to="/admin" replace />;
}

export default AdminOnlyRoute;
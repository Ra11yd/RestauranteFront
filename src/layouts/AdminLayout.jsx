import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../pages/Admin.css';

function AdminLayout() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkStyle = {
    padding: '10px 15px',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    transition: 'background-color 0.2s ease-in-out',
    fontWeight: 'bold'
  };

  const activeLinkStyle = {
    ...linkStyle,
    backgroundColor: 'var(--cor-secundaria-amarelo)',
    color: 'var(--cor-fundo-escuro)',
  };

  return (
    <div>
      <nav style={{
        background: 'var(--cor-card-fundo)',
        padding: '0 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 2000,
        borderBottom: '2px solid var(--cor-borda-cinza)'
      }}>
        <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
          <Link to="/admin" style={location.pathname === '/admin' ? activeLinkStyle : linkStyle}>Painel</Link>
          
          {/* Mostra os links de gerenciamento apenas se o usuário for 'admin' ou 'superadmin' */}
          {(user?.role === 'admin' || user?.role === 'superadmin') && (
            <>
              <Link to="/admin/products" style={location.pathname === '/admin/products' ? activeLinkStyle : linkStyle}>Produtos</Link>
              <Link to="/admin/categories" style={location.pathname === '/admin/categories' ? activeLinkStyle : linkStyle}>Categorias</Link>
              <Link to="/admin/tables" style={location.pathname === '/admin/tables' ? activeLinkStyle : linkStyle}>Mesas</Link>
              <Link to="/admin/delivery-zones" style={location.pathname === '/admin/delivery-zones' ? activeLinkStyle : linkStyle}>Taxas de Entrega</Link>
              <Link to="/admin/employees" style={location.pathname === '/admin/employees' ? activeLinkStyle : linkStyle}>Funcionários</Link>
              <Link to="/admin/appearance" style={location.pathname === '/admin/appearance' ? activeLinkStyle : linkStyle}>Aparência</Link>
              <Link to="/admin/settings" style={location.pathname === '/admin/settings' ? activeLinkStyle : linkStyle}>Configurações</Link>
            </>
          )}

          {user?.role === 'superadmin' && (
            <Link to="/super-admin" style={location.pathname === '/super-admin' ? activeLinkStyle : linkStyle}>Super Admin</Link>
          )}
        </div>
        
        <div style={{display: 'flex', gap: '1.5rem', alignItems: 'center'}}>
          {user?.companySlug && (
            <>
              <a href={`/loja/${user.companySlug}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cor-secundaria-amarelo)', textDecoration: 'none', fontWeight: 'bold' }}>
                Ver Loja (Delivery)
              </a>
              <a href={`/salao/${user.companySlug}`} target="_blank" rel="noopener noreferrer" style={{ color: '#00BFFF', textDecoration: 'none', fontWeight: 'bold' }}>
                Ver Salão
              </a>
            </>
          )}
          {isAuthenticated && (
            <button onClick={handleLogout} style={{ background: 'var(--cor-primaria-vermelho)', border: 'none', color: 'white', cursor: 'pointer', padding: '8px 12px', borderRadius: '5px', fontWeight: 'bold' }}>
              Sair
            </button>
          )}
        </div>
      </nav>
      
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
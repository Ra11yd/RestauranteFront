// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // A função login agora retorna os dados do usuário ou nulo
      const loggedInUser = await login(username, password);

      if (loggedInUser) {
        // --- LÓGICA DE REDIRECIONAMENTO INTELIGENTE ---
        if (loggedInUser.role === 'superadmin') {
          navigate('/super-admin'); // Se for superadmin, vai para o painel de super admin
        } else {
          navigate('/admin'); // Se for admin normal, vai para o painel normal
        }
      } else {
        setError('Usuário ou senha inválidos.');
      }
    } catch (err) {
      setError('Ocorreu um erro. Tente novamente mais tarde.');
    }
  };

  // O JSX do formulário continua o mesmo
  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh'}}>
      <form onSubmit={handleSubmit} style={{width: '300px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', backgroundColor: 'var(--cor-card-fundo)'}}>
        <h2 style={{textAlign: 'center', color: 'var(--cor-secundaria-amarelo)'}}>Login do Administrador</h2>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <div style={{ marginBottom: '15px' }}>
          <label style={{color: 'var(--cor-texto-claro)'}}>Usuário:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}/>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{color: 'var(--cor-texto-claro)'}}>Senha:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}/>
        </div>
        <button type="submit" className="btn-add" style={{ width: '100%' }}>
          Entrar
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
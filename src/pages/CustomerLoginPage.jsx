import React, { useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import api from '../api/api';
import { useCustomerAuth } from '../context/CustomerAuthContext';

function CustomerLoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { slug } = useParams();
  const { customerLogin } = useCustomerAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // 1. Busca os dados da empresa (incluindo o ID) usando o slug
      const companyRes = await api.get(`/public/menu/${slug}`);
      if (!companyRes.data?.settings?.companyId) {
        throw new Error("Não foi possível encontrar a empresa.");
      }
      const companyId = companyRes.data.settings.companyId;

      // 2. Tenta fazer o login com os dados do formulário + companyId
      const loginRes = await api.post('/customer/login', { ...formData, companyId });
      
      // 3. Salva o token no nosso context e redireciona
      customerLogin(loginRes.data.token);
      navigate(`/loja/${slug}`); // Volta para a loja

    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao fazer login.');
    }
  };

  return (
    <div style={{maxWidth: '400px', margin: '3rem auto', padding: '2rem', backgroundColor: '#2a2a2a', borderRadius: '8px'}}>
      <h2 style={{color: '#FFC107', textAlign: 'center'}}>Login de Cliente</h2>
      <form onSubmit={handleSubmit}>
        <div style={{marginBottom: '1rem'}}>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{width: '100%'}} />
        </div>
        <div style={{marginBottom: '1rem'}}>
          <label>Senha:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required style={{width: '100%'}} />
        </div>
        {error && <p style={{color: '#E53935'}}>{error}</p>}
        <button type="submit" style={{width: '100%'}}>Entrar</button>
      </form>
      <p style={{textAlign: 'center', marginTop: '1rem'}}>
        Não tem uma conta? <Link to={`/cadastro/${slug}`}>Cadastre-se</Link>
      </p>
    </div>
  );
}

export default CustomerLoginPage;
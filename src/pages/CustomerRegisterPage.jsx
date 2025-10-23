import React, { useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import api from '../api/api';

function CustomerRegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { slug } = useParams();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      // 1. Busca os dados da empresa para obter o companyId
      const companyRes = await api.get(`/public/menu/${slug}`);
      if (!companyRes.data?.settings?.companyId) {
        throw new Error("Não foi possível encontrar a empresa para o cadastro.");
      }
      const companyId = companyRes.data.settings.companyId;

      // 2. Tenta registrar o cliente
      const registerRes = await api.post('/customer/register', { ...formData, companyId });
      
      // 3. Mostra mensagem de sucesso e redireciona para o login
      setMessage(registerRes.data.message);
      setTimeout(() => navigate(`/login/${slug}`), 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao se registrar.');
    }
  };

  return (
    <div style={{maxWidth: '400px', margin: '3rem auto', padding: '2rem', backgroundColor: '#2a2a2a', borderRadius: '8px'}}>
      <h2 style={{color: '#FFC107', textAlign: 'center'}}>Criar Conta</h2>
      <form onSubmit={handleSubmit}>
        <div style={{marginBottom: '1rem'}}><label>Nome:</label><input type="text" name="name" value={formData.name} onChange={handleChange} required /></div>
        <div style={{marginBottom: '1rem'}}><label>Email:</label><input type="email" name="email" value={formData.email} onChange={handleChange} required /></div>
        <div style={{marginBottom: '1rem'}}><label>Senha:</label><input type="password" name="password" value={formData.password} onChange={handleChange} required /></div>
        <div style={{marginBottom: '1rem'}}><label>Telefone (WhatsApp):</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} /></div>
        
        {error && <p style={{color: '#E53935'}}>{error}</p>}
        {message && <p style={{color: '#25D366'}}>{message}</p>}
        
        <button type="submit">Registrar</button>
      </form>
      <p style={{textAlign: 'center', marginTop: '1rem'}}>
        Já tem uma conta? <Link to={`/login/${slug}`}>Faça o login</Link>
      </p>
    </div>
  );
}

export default CustomerRegisterPage;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import './Admin.css';

function AdminSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', whatsapp: '', message: '', pixKey: '' });
  const [newLogoFile, setNewLogoFile] = useState(null);
  const [newPixQrCodeFile, setNewPixQrCodeFile] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.companyId) return;
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await api.get('/settings', { params: { companyId: user.companyId } });
        setSettings(response.data);
        setFormData({ 
          name: response.data.restaurantName, 
          whatsapp: response.data.whatsappNumber || '',
          message: response.data.whatsappMessage || 'Olá, seu pedido está a caminho! :)',
          pixKey: response.data.pixKey || ''
        });
      } catch (error) { console.error("Erro ao buscar configurações:", error); } 
      finally { setLoading(false); }
    };
    fetchSettings();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('restaurantName', formData.name);
    data.append('whatsappNumber', formData.whatsapp);
    data.append('whatsappMessage', formData.message);
    data.append('pixKey', formData.pixKey);
    data.append('companyId', user.companyId);
    if (newLogoFile) data.append('logo', newLogoFile);
    if (newPixQrCodeFile) data.append('pixQrCode', newPixQrCodeFile);

    try {
      const response = await api.patch('/settings', data);
      setSettings(response.data);
      setNewLogoFile(null);
      setNewPixQrCodeFile(null);
      document.getElementById('logo-input').value = "";
      document.getElementById('pix-qr-input').value = "";
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      alert('Não foi possível salvar as alterações.');
    }
  };

  if (loading) return <div className="admin-container"><p>Carregando...</p></div>;

  return (
    <div className="admin-container">
      <Link to="/admin">← Voltar para o Painel Principal</Link>
      <h1 className="admin-header" style={{ marginTop: '20px' }}>Configurações da Loja</h1>
      <div className="admin-form-container">
        <h3>Alterar Configurações</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="name">Nome do Restaurante:</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="logo-input">Alterar Logo:</label>
            <input type="file" id="logo-input" onChange={(e) => setNewLogoFile(e.target.files[0])} style={{ display: 'block' }}/>
          </div>
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--cor-borda-cinza)' }}>
            <h4>Configurações de Contato</h4>
            <div style={{ marginBottom: '1rem', marginTop: '1rem' }}>
              <label htmlFor="whatsapp">Nº de WhatsApp (ex: 55249...):</label>
              <input type="text" id="whatsapp" name="whatsapp" value={formData.whatsapp} onChange={handleChange} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="message">Mensagem de "Pedido a Caminho":</label>
              <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows="3" style={{width: '100%', minHeight: '80px'}}/>
            </div>
          </div>
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--cor-borda-cinza)' }}>
            <h4>Configurações de Pagamento PIX</h4>
            <div style={{ marginBottom: '1rem', marginTop: '1rem' }}>
              <label htmlFor="pixKey">Chave PIX (ex: e-mail, telefone, CNPJ):</label>
              <input type="text" id="pixKey" name="pixKey" value={formData.pixKey} onChange={handleChange} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="pix-qr-input">Imagem do QR Code PIX:</label>
              <input type="file" id="pix-qr-input" onChange={(e) => setNewPixQrCodeFile(e.target.files[0])} style={{ display: 'block' }}/>
            </div>
          </div>
          <button type="submit" className="btn-add" style={{marginTop: '2rem'}}>Salvar Alterações</button>
        </form>
      </div>
    </div>
  );
}
export default AdminSettingsPage;
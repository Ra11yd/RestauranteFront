import React, { useState, useEffect } from 'react';
import api from '../api/api';
import './Admin.css';
import EditCompanyModal from '../components/EditCompanyModal';
import EditUserModal from '../components/EditUserModal';

function SuperAdminPage() {
  console.log("1. SuperAdminPage: Componente INICIOU a renderização.");

  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newUserData, setNewUserData] = useState({ username: '', password: '', companyId: '', role: 'admin' });
  const [editingCompany, setEditingCompany] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    console.log("2. SuperAdminPage: useEffect foi ACIONADO.");
    fetchData();
  }, []);

  const fetchData = async () => {
    console.log("3. SuperAdminPage: Função fetchData FOI CHAMADA.");
    try {
      const [companiesRes, usersRes] = await Promise.all([
        api.get('/companies'),
        api.get('/users')
      ]);

      console.log("4. SuperAdminPage: Resposta da API RECEBIDA.", {
        companiesData: companiesRes.data,
        usersData: usersRes.data
      });

      setCompanies(companiesRes.data);
      setUsers(usersRes.data);

      console.log("5. SuperAdminPage: Estados de companies e users ATUALIZADOS.");

    } catch (error) {
      console.error("ERRO CRÍTICO NO FETCHDATA:", error);
      alert('ERRO CRÍTICO AO BUSCAR DADOS! Verifique o console.');
    }
  };

  const handleAddCompany = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/companies', { name: newCompanyName });
      alert(`Empresa "${response.data.name}" criada com sucesso!`);
      setNewCompanyName('');
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Não foi possível criar a empresa.');
    }
  };

  const handleUserInputChange = (e) => setNewUserData({ ...newUserData, [e.target.name]: e.target.value });

  const handleRegisterUser = async (e) => {
    e.preventDefault();
    if (!newUserData.companyId) return alert('Por favor, selecione uma empresa.');
    try {
      const response = await api.post('/auth/register', newUserData);
      alert(response.data.message);
      setNewUserData({ username: '', password: '', companyId: '', role: 'admin' });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Não foi possível registrar o usuário.');
    }
  };

  const handleDeleteCompany = async (companyId) => {
    if (window.confirm("Tem certeza que deseja excluir esta empresa?")) {
      try {
        const response = await api.delete(`/companies/${companyId}`);
        alert(response.data.message);
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || "Não foi possível excluir a empresa.");
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        const response = await api.delete(`/users/${userId}`);
        alert(response.data.message);
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || "Não foi possível excluir o usuário.");
      }
    }
  };

  const handleEditCompanyClick = (company) => setEditingCompany(company);
  const handleCompanyUpdated = (updatedCompany) => {
    setCompanies(companies.map(c => c._id === updatedCompany._id ? updatedCompany : c));
  };

  const handleEditUserClick = (user) => setEditingUser(user);
  const handleUserUpdated = () => fetchData();
  const handleCloseModal = () => { setEditingCompany(null); setEditingUser(null); };
  
  console.log(`6. SuperAdminPage: Preparando para RENDERIZAR com ${companies.length} empresas e ${users.length} usuários.`);

  return (
    <div className="admin-container">
      <h1 className="admin-header">Painel do Super Administrador</h1>
      <p style={{ color: 'var(--cor-texto-secundaria)' }}>Bem-vindo, Síndico! Esta é a sua área de gerenciamento da plataforma.</p>
      
      <div className="admin-form-container" style={{ marginTop: '2rem' }}>
        <h3>Criar Nova Empresa</h3>
        <form onSubmit={handleAddCompany} style={{ display: 'flex', gap: '10px' }}>
          <input type="text" value={newCompanyName} onChange={(e) => setNewCompanyName(e.target.value)} placeholder="Nome da nova empresa" required style={{ flex: 1 }} />
          <button type="submit" className="btn-add">Criar Empresa</button>
        </form>
      </div>

      <div className="admin-form-container" style={{ marginTop: '2rem' }}>
        <h3>Registrar Novo Administrador</h3>
        <form onSubmit={handleRegisterUser}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <input type="text" name="username" value={newUserData.username} onChange={handleUserInputChange} placeholder="Nome do usuário (login)" required style={{ flex: 1, minWidth: '150px' }} />
            <input type="password" name="password" value={newUserData.password} onChange={handleUserInputChange} placeholder="Senha" required style={{ flex: 1, minWidth: '150px' }} />
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <select name="companyId" value={newUserData.companyId} onChange={handleUserInputChange} required style={{ flex: 1, minWidth: '200px' }}>
              <option value="">Selecione a empresa</option>
              {companies.map(company => (
                <option key={company._id} value={company._id}>{company.name}</option>
              ))}
            </select>
            <button type="submit" className="btn-add">Registrar Usuário</button>
          </div>
        </form>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>Empresas Cadastradas ({companies.length})</h2>
        <table className="admin-table">
          <thead><tr><th>Nome</th><th>Slug</th><th>Ações</th></tr></thead>
          <tbody>
            {companies.map(company => (
              <tr key={company._id}>
                <td style={{ color: 'white' }}>{company.name}</td>
                <td>{company.slug}</td>
                <td style={{ textAlign: 'center' }}>
                  <button onClick={() => handleEditCompanyClick(company)} className="action-btn btn-edit">Editar</button>
                  <button onClick={() => handleDeleteCompany(company._id)} className="action-btn btn-delete">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>Usuários da Plataforma ({users.length})</h2>
        <table className="admin-table">
          <thead><tr><th>Username</th><th>Função (Role)</th><th>Empresa</th><th>Ações</th></tr></thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td style={{ color: 'white' }}>{user.username}</td>
                <td>{user.role}</td>
                <td>{companies.find(c => c._id === user.companyId)?.name || 'N/A (Super Admin)'}</td>
                <td style={{ textAlign: 'center' }}>
                  <button onClick={() => handleEditUserClick(user)} className="action-btn btn-edit">Editar</button>
                  <button onClick={() => handleDeleteUser(user._id)} className="action-btn btn-delete">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EditCompanyModal company={editingCompany} onClose={handleCloseModal} onCompanyUpdated={handleCompanyUpdated} />
      <EditUserModal user={editingUser} onClose={handleCloseModal} onUserUpdated={handleUserUpdated} />
    </div>
  );
}

export default SuperAdminPage;
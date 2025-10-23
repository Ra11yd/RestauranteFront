import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import './Admin.css';

function AdminTablesPage() {
  const [tables, setTables] = useState([]);
  const [newTableName, setNewTableName] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTables();
    }
  }, [user]);

  const fetchTables = async () => {
    try {
      const response = await api.get('/tables');
      setTables(response.data);
    } catch (error) {
      console.error("Erro ao buscar mesas:", error);
    }
  };

  const handleAddTable = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tables', { name: newTableName });
      setNewTableName('');
      fetchTables();
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao adicionar mesa.');
    }
  };

  const handleDeleteTable = async (tableId) => {
    if (window.confirm("Tem certeza que deseja excluir esta mesa?")) {
      try {
        await api.delete(`/tables/${tableId}`);
        fetchTables();
      } catch (error) {
        alert('Não foi possível excluir a mesa.');
      }
    }
  };

  return (
    <div className="admin-container">
      <Link to="/admin">← Voltar para o Painel Principal</Link>
      <h1 className="admin-header" style={{ marginTop: '20px' }}>Gerenciar Mesas do Salão</h1>
      
      <div className="admin-form-container">
        <h3>Adicionar Nova Mesa</h3>
        <form onSubmit={handleAddTable} style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            value={newTableName}
            onChange={(e) => setNewTableName(e.target.value)}
            placeholder="Nome da Mesa (ex: Mesa 01, Varanda)"
            required 
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn-add">Adicionar Mesa</button>
        </form>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Nomes das Mesas Cadastradas</th>
            <th style={{width: '150px'}}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {tables.map(table => (
            <tr key={table._id}>
              <td style={{color: 'white', fontWeight: 'bold'}}>{table.name}</td>
              <td style={{textAlign: 'center'}}>
                <button onClick={() => handleDeleteTable(table._id)} className="action-btn btn-delete">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminTablesPage;
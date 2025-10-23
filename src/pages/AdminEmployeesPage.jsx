import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import './Admin.css';

function AdminEmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ username: '', password: '' });
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchEmployees();
    }
  }, [user]);

  const fetchEmployees = async () => {
    try {
      // Usa a nova rota para buscar apenas funcionários da empresa do admin logado
      const response = await api.get('/users/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error);
    }
  };

  const handleInputChange = (e) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      // Usa a nova rota para criar um funcionário
      await api.post('/users/employee', newEmployee);
      setNewEmployee({ username: '', password: '' });
      fetchEmployees(); // Recarrega a lista
      alert('Funcionário adicionado com sucesso!');
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao adicionar funcionário.');
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm("Tem certeza que deseja excluir este funcionário?")) {
      try {
        // A rota de exclusão usa o endpoint do superadmin, mas o back-end validará a permissão
        await api.delete(`/users/${employeeId}`);
        fetchEmployees(); // Recarrega a lista
        alert('Funcionário excluído com sucesso.');
      } catch (error) {
        alert('Não foi possível excluir o funcionário.');
      }
    }
  };

  return (
    <div className="admin-container">
      <Link to="/admin">← Voltar para o Painel Principal</Link>
      <h1 className="admin-header" style={{ marginTop: '20px' }}>Gerenciar Funcionários</h1>
      
      <div className="admin-form-container">
        <h3>Adicionar Novo Funcionário</h3>
        <form onSubmit={handleAddEmployee} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            name="username"
            value={newEmployee.username}
            onChange={handleInputChange}
            placeholder="Nome de usuário do funcionário"
            required 
            style={{ flex: 1, minWidth: '200px' }}
          />
          <input 
            type="password" 
            name="password"
            value={newEmployee.password}
            onChange={handleInputChange}
            placeholder="Senha"
            required 
            style={{ flex: 1, minWidth: '200px' }}
          />
          <button type="submit" className="btn-add">Adicionar</button>
        </form>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Nome de Usuário</th>
            <th style={{width: '150px'}}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee._id}>
              <td style={{color: 'white', fontWeight: 'bold'}}>{employee.username}</td>
              <td style={{textAlign: 'center'}}>
                <button onClick={() => handleDeleteEmployee(employee._id)} className="action-btn btn-delete">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminEmployeesPage;
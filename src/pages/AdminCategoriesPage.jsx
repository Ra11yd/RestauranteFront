import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import EditCategoryModal from '../components/EditCategoryModal';
import './Admin.css';

function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryOrder, setNewCategoryOrder] = useState(0);
  const [editingCategory, setEditingCategory] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCategories();
    }
  }, [user]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories', { params: { companyId: user.companyId } });
      setCategories(response.data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', { 
        name: newCategoryName, 
        order: newCategoryOrder
      });
      setNewCategoryName('');
      setNewCategoryOrder(0);
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao criar categoria.');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Tem certeza que deseja excluir esta categoria?")) {
      try {
        await api.delete(`/categories/${categoryId}`);
        fetchCategories();
      } catch (error) {
        alert(error.response?.data?.message || 'Não foi possível excluir a categoria.');
      }
    }
  };

  const handleUpdateCategory = async (categoryToUpdate) => {
    try {
      await api.patch(`/categories/${categoryToUpdate._id}`, {
        name: categoryToUpdate.name,
        order: categoryToUpdate.order
      });
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      alert('Não foi possível atualizar a categoria.');
    }
  };

  return (
    <div className="admin-container">
      <Link to="/admin">← Voltar para o Painel Principal</Link>
      <h1 className="admin-header" style={{ marginTop: '20px' }}>Gerenciar Categorias</h1>
      
      <div className="admin-form-container">
        <h3>Adicionar Nova Categoria</h3>
        <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input 
            type="text" 
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Nome da Categoria"
            required 
            style={{ flex: 1 }}
          />
          <input 
            type="number" 
            value={newCategoryOrder}
            onChange={(e) => setNewCategoryOrder(e.target.value)}
            placeholder="Ordem"
            style={{ width: '100px' }}
          />
          <button type="submit" className="btn-add">Adicionar</button>
        </form>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th style={{width: '100px'}}>Ordem</th>
            <th>Nome da Categoria</th>
            <th style={{width: '200px'}}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => (
            <tr key={category._id}>
              <td>{category.order}</td>
              <td style={{color: 'white'}}>{category.name}</td>
              <td style={{textAlign: 'center'}}>
                <button onClick={() => setEditingCategory(category)} className="action-btn" style={{marginRight: '10px'}}>Editar</button>
                <button onClick={() => handleDeleteCategory(category._id)} className="action-btn btn-delete">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
          onSave={handleUpdateCategory}
        />
      )}
    </div>
  );
}

export default AdminCategoriesPage;
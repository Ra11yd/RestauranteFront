// src/components/EditUserModal.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/api';
import '../pages/Admin.css';

function EditUserModal({ user, onClose, onUserUpdated }) {
  const [formData, setFormData] = useState({ username: '', password: '' });

  useEffect(() => {
    if (user) {
      setFormData({ username: user.username, password: '' }); // Não preenche a senha
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const updateData = { username: formData.username };
    // Só envia a senha se o campo não estiver vazio
    if (formData.password) {
        updateData.password = formData.password;
    }

    try {
      await api.patch(`/users/${user._id}`, updateData);
      onUserUpdated();
      onClose();
      alert('Usuário atualizado com sucesso!');
    } catch (error) {
      alert('Não foi possível atualizar o usuário.');
    }
  };

  if (!user) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Editar Usuário</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label>Nome de Usuário:</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required style={{ width: '100%' }}/>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Nova Senha (deixe em branco para não alterar):</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} style={{ width: '100%' }}/>
          </div>
          <div>
            <button type="submit" className="btn-add">Salvar Alterações</button>
            <button type="button" onClick={onClose} style={{ marginLeft: '10px' }}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUserModal;
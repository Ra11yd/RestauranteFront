import React, { useState, useEffect } from 'react';
import api from '../api/api';
import '../pages/Admin.css'; // Reutiliza os estilos

function EditCompanyModal({ company, onClose, onCompanyUpdated }) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (company) {
      setName(company.name);
    }
  }, [company]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.patch(`/companies/${company._id}`, { name });
      onCompanyUpdated(response.data);
      onClose(); // <-- A chamada para fechar o modal
      alert('Empresa atualizada com sucesso!');
    } catch (error) {
      alert('Não foi possível atualizar a empresa.');
      console.error("Erro ao atualizar empresa:", error);
    }
  };

  if (!company) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Editar Empresa</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label>Nome da Empresa:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: '100%', marginTop: '0.5rem' }}
            />
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

export default EditCompanyModal;
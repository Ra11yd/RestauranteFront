import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import '../pages/Admin.css';

function EditDeliveryZoneModal({ zone, onClose, onZoneUpdated }) {
  const [formData, setFormData] = useState({ name: '', fee: '' }); // <-- LINHA CORRIGIDA
  const { user } = useAuth();

  useEffect(() => {
    if (zone) {
      setFormData({ name: zone.name, fee: zone.fee });
    }
  }, [zone]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.patch(`/delivery-zones/${zone._id}`, {
        name: formData.name,
        fee: parseFloat(formData.fee),
        companyId: user.companyId
      });
      onZoneUpdated(response.data);
      onClose();
      alert('Bairro atualizado com sucesso!');
    } catch (error) {
      alert('Não foi possível atualizar o bairro.');
    }
  };

  if (!zone) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Editar Bairro / Taxa</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label>Nome do Bairro:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', marginTop: '0.5rem' }}/>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Taxa de Entrega (R$):</label>
            <input type="number" name="fee" value={formData.fee} onChange={handleChange} required step="0.01" style={{ width: '100%', marginTop: '0.5rem' }}/>
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

export default EditDeliveryZoneModal;
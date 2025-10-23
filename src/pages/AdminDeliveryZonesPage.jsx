import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import EditDeliveryZoneModal from '../components/EditDeliveryZoneModal';
import './Admin.css';

function AdminDeliveryZonesPage() {
  const [zones, setZones] = useState([]); // <-- LINHA CORRIGIDA
  const [newZone, setNewZone] = useState({ name: '', fee: '' });
  const [editingZone, setEditingZone] = useState(null);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user?.companyId) {
      fetchZones();
    }
  }, [user, authLoading]);

  const fetchZones = async () => {
    try {
      const response = await api.get('/delivery-zones', { params: { companyId: user.companyId } });
      setZones(response.data);
    } catch (error) {
      console.error("Erro ao buscar zonas de entrega:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewZone({ ...newZone, [name]: value });
  };

  const handleAddZone = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/delivery-zones', { ...newZone, companyId: user.companyId });
      setZones([...zones, response.data].sort((a, b) => a.name.localeCompare(b.name)));
      setNewZone({ name: '', fee: '' });
      alert('Bairro adicionado com sucesso!');
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao adicionar bairro.');
    }
  };

  const handleDeleteZone = async (zoneId) => {
    if (window.confirm("Tem certeza que deseja excluir este bairro?")) {
      try {
        await api.delete(`/delivery-zones/${zoneId}`, { data: { companyId: user.companyId } });
        setZones(zones.filter(z => z._id !== zoneId));
        alert("Bairro excluído.");
      } catch (error) { alert('Não foi possível excluir o bairro.'); }
    }
  };

  const handleEditClick = (zone) => setEditingZone(zone);
  const handleCloseModal = () => setEditingZone(null);
  const handleZoneUpdated = (updatedZone) => {
    setZones(zones.map(z => z._id === updatedZone._id ? updatedZone : z));
  };

  return (
    <div className="admin-container">
      <Link to="/admin">← Voltar para o Painel Principal</Link>
      <h1 className="admin-header" style={{ marginTop: '20px' }}>Gerenciar Taxas de Entrega</h1>
      <div className="admin-form-container">
        <h3>Adicionar Novo Bairro</h3>
        <form onSubmit={handleAddZone} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input type="text" name="name" value={newZone.name} onChange={handleInputChange} placeholder="Nome do Bairro" required style={{ flex: 1, minWidth: '200px' }} disabled={authLoading} />
          <input type="number" name="fee" value={newZone.fee} onChange={handleInputChange} placeholder="Taxa (ex: 5.00)" required step="0.01" style={{ width: '150px' }} disabled={authLoading} />
          <button type="submit" className="btn-add" disabled={authLoading}>{authLoading ? 'Carregando...' : 'Adicionar'}</button>
        </form>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Nome do Bairro</th>
            <th>Taxa de Entrega (R$)</th>
            <th style={{width: '200px'}}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {zones.map(zone => (
            <tr key={zone._id}>
              <td style={{color: 'white'}}>{zone.name}</td>
              <td>{zone.fee.toFixed(2).replace('.', ',')}</td>
              <td style={{textAlign: 'center'}}>
                <button onClick={() => handleEditClick(zone)} className="action-btn btn-edit">Editar</button>
                <button onClick={() => handleDeleteZone(zone._id)} className="action-btn btn-delete">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <EditDeliveryZoneModal
        zone={editingZone}
        onClose={handleCloseModal}
        onZoneUpdated={handleZoneUpdated}
      />
    </div>
  );
}

export default AdminDeliveryZonesPage;
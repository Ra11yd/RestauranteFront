import React, { useState } from 'react';
import './Modal.css'; // Vamos usar um CSS genérico de modal

function EditCategoryModal({ category, onClose, onSave }) { // 1. Corrigido para receber 'onSave'
  const [name, setName] = useState(category.name);
  const [order, setOrder] = useState(category.order || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    // 2. Chama 'onSave' com os dados atualizados
    onSave({
      ...category,
      name: name,
      order: order
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Editar Categoria</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nome da Categoria:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="order">Ordem:</label>
            <input
              type="number"
              id="order"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
            <button type="submit" className="btn-add">Salvar Alterações</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCategoryModal;
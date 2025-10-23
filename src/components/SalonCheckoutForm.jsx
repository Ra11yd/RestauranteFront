import React, { useState } from 'react';

function SalonCheckoutForm({ tables = [], onCheckout }) {
  const [name, setName] = useState('');
  const [table, setTable] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !table) {
      alert("Por favor, preencha seu nome e selecione uma mesa.");
      return;
    }
    onCheckout({ name, table });
  };

  return (
    <form onSubmit={handleSubmit} style={{padding: '1rem'}}>
      <h4>Identificação do Pedido</h4>
      <div style={{marginTop: '1rem'}}>
        <label>Seu Nome:</label><br/>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
          style={{width: '100%', padding: '8px', boxSizing: 'border-box', marginTop: '0.5rem'}}
        />
      </div>
      <div style={{marginTop: '1rem'}}>
        <label>Sua Mesa:</label><br/>
        <select 
          value={table} 
          onChange={(e) => setTable(e.target.value)} 
          required 
          style={{width: '100%', padding: '8px', boxSizing: 'border-box', marginTop: '0.5rem'}}
        >
          <option value="">Selecione sua mesa</option>
          {tables.map(t => (
            <option key={t._id} value={t.name}>{t.name}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="adicionar-btn" style={{marginTop: '1.5rem', width: '100%'}}>
        Enviar Pedido para Cozinha
      </button>
    </form>
  );
}

export default SalonCheckoutForm;
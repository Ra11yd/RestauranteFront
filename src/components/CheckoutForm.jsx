import React, { useState, useEffect } from 'react';

function CheckoutForm({ onCheckout, onNeighborhoodChange, deliveryZones = [] }) {
  const [formData, setFormData] = useState({ 
    name: '', 
    phone: '', 
    address: '', 
    neighborhood: '', 
    paymentMethod: '', 
    changeFor: '' 
  });
  
  // Novo estado para controlar a visibilidade do campo de troco
  const [showChangeFor, setShowChangeFor] = useState(false);

  // Este efeito "assiste" a mudanças no campo de forma de pagamento
  useEffect(() => {
    if (formData.paymentMethod === 'Dinheiro') {
      setShowChangeFor(true);
    } else {
      setShowChangeFor(false);
    }
  }, [formData.paymentMethod]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    if (name === 'neighborhood') {
      onNeighborhoodChange(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCheckout(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{padding: '0 1rem 1rem 1rem'}}>
      <h4>Finalizar Compra</h4>
      
      <div>
        <label>Nome:</label><br/>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
      </div>
      <div style={{marginTop: '1rem'}}>
        <label>Telefone (WhatsApp):</label><br/>
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
      </div>
      <div style={{marginTop: '1rem'}}>
        <label>Endereço Completo:</label><br/>
        <textarea name="address" value={formData.address} onChange={handleChange} required style={{ width: '100%', padding: '8px', minHeight: '60px', boxSizing: 'border-box' }} />
      </div>
      
      <div style={{marginTop: '1rem'}}>
        <label>Bairro:</label><br/>
        <select name="neighborhood" value={formData.neighborhood} onChange={handleChange} required style={{ width: '100%', padding: '8px' }}>
          <option value="">Selecione o bairro</option>
          {deliveryZones.map(zone => (
            <option key={zone._id} value={zone.name}>
              {zone.name} - (R$ {zone.fee.toFixed(2).replace('.', ',')})
            </option>
          ))}
        </select>
      </div>

      <div style={{marginTop: '1rem'}}>
        <label>Forma de Pagamento:</label><br/>
        <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required style={{ width: '100%', padding: '8px' }}>
          <option value="">Selecione a forma de pagamento</option>
          <option value="Pix">Pix</option>
          <option value="Cartão de Débito">Cartão de Débito</option>
          <option value="Cartão de Crédito">Cartão de Crédito</option>
          <option value="Dinheiro">Dinheiro</option>
        </select>
      </div>

      {showChangeFor && (
        <div style={{marginTop: '1rem'}}>
          <label><strong>Troco para:</strong></label><br/>
          <input 
            type="text" 
            name="changeFor" 
            value={formData.changeFor} 
            onChange={handleChange} 
            placeholder="Ex: 50, 100"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', marginTop: '0.5rem' }} 
          />
        </div>
      )}

      <button type="submit" className="adicionar-btn" style={{marginTop: '1.5rem', width: '100%'}}>
        Finalizar Pedido
      </button>
    </form>
  );
}

export default CheckoutForm;
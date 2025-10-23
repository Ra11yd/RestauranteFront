// src/components/AddProductForm.jsx

import React, { useState } from 'react';
import api from '../api/api';

function AddProductForm({ categories, onProductAdded, companyId }) {
  const initialFormData = {
    name: '',
    description: '',
    price: '',
    category: '',
    addOns: []
  };
  
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    setFormData(prevData => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleAddOnChange = (index, event) => {
    const newAddOns = formData.addOns.map((addOn, i) => {
      if (index !== i) return addOn;
      return { ...addOn, [event.target.name]: event.target.value };
    });
    setFormData({ ...formData, addOns: newAddOns });
  };

  const handleAddOn = () => {
    setFormData({ ...formData, addOns: [...formData.addOns, { name: '', price: '' }] });
  };

  const handleRemoveAddOn = (index) => {
    const newAddOns = formData.addOns.filter((_, i) => i !== index);
    setFormData({ ...formData, addOns: newAddOns });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category) {
        alert('Por favor, selecione uma categoria.');
        return;
    }
    if (!companyId) {
        alert('Erro: ID da empresa não encontrado. Recarregue a página.');
        return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('addOns', JSON.stringify(formData.addOns));
    data.append('companyId', companyId); 
    if (imageFile) {
      data.append('imageUrl', imageFile);
    }

    try {
      const response = await api.post('/products', data);
      alert('Produto adicionado com sucesso!');
      onProductAdded(response.data);
      setFormData(initialFormData);
      setImageFile(null);
      e.target.reset();
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      alert('Não foi possível adicionar o produto.');
    }
  };

  return (
    <div>
      <h3>Adicionar Novo Produto</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Nome do Produto:</label><br/>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Descrição:</label><br/>
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Preço Base (ex: 10.50):</label><br/>
          <input type="number" name="price" value={formData.price} onChange={handleChange} required step="0.01" />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Categoria:</label><br/>
          <select name="category" value={formData.category} onChange={handleChange} required >
            <option value="">Selecione uma categoria</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Imagem do Produto:</label><br/>
          <input type="file" name="image" onChange={handleImageChange} accept="image/*" />
        </div>

        <div style={{ marginTop: '20px', borderTop: '1px solid var(--cor-borda-cinza)', paddingTop: '20px' }}>
          <label style={{ fontWeight: 'bold' }}>Adicionais (Opcional):</label>
          {formData.addOns.map((addOn, index) => (
            <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' }}>
              <input type="text" name="name" placeholder="Nome do Adicional" value={addOn.name} onChange={(e) => handleAddOnChange(index, e)} style={{ flex: 1 }} />
              <input type="number" name="price" placeholder="Preço" value={addOn.price} onChange={(e) => handleAddOnChange(index, e)} style={{ width: '100px' }} step="0.01" />
              <button type="button" onClick={() => handleRemoveAddOn(index)} className="action-btn btn-delete">Remover</button>
            </div>
          ))}
          <button type="button" onClick={handleAddOn} style={{ marginTop: '10px' }}>+ Adicionar Adicional</button>
        </div>
        
        <button type="submit" className="btn-add" style={{ marginTop: '20px' }}>Adicionar Produto</button>
      </form>
    </div>
  );
}

export default AddProductForm;
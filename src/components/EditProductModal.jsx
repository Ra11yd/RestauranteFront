import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import '../pages/Admin.css';

function EditProductModal({ product, categories, onClose, onProductUpdated }) {
  // Inicializa o estado com um objeto, previne o valor 'null'
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    // Popula o formulário quando um produto é recebido
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        category: product.category?._id || product.category,
      });
    }
  }, [product]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleImageChange = (e) => setImageFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Verificação de segurança para garantir que 'product' não é nulo
    if (!product) {
      alert("Erro: produto não encontrado para edição.");
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('companyId', user.companyId);
    if (imageFile) {
      data.append('imageUrl', imageFile);
    }

    try {
      const response = await api.patch(`/products/${product._id}`, data);
      onProductUpdated(response.data);
      onClose();
      alert('Produto atualizado com sucesso!');
    } catch (error) {
      console.error("Erro ao atualizar produto:", error)
      alert('Não foi possível atualizar o produto.');
    }
  };

  // A guarda principal para renderização agora é no 'product'
  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Editar Produto</h2>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: '1rem'}}><label>Nome:</label><input type="text" name="name" value={formData.name} onChange={handleChange} required style={{width: '100%'}}/></div>
          <div style={{marginBottom: '1rem'}}><label>Descrição:</label><textarea name="description" value={formData.description} onChange={handleChange} style={{width: '100%', minHeight: '60px'}}></textarea></div>
          <div style={{marginBottom: '1rem'}}><label>Preço:</label><input type="number" name="price" value={formData.price} onChange={handleChange} required step="0.01" style={{width: '100%'}}/></div>
          <div style={{marginBottom: '1rem'}}><label>Categoria:</label>
            <select name="category" value={formData.category} onChange={handleChange} required style={{width: '100%'}}>
              <option value="">Selecione uma categoria</option>
              {categories.map(cat => (<option key={cat._id} value={cat._id}>{cat.name}</option>))}
            </select>
          </div>
          <div style={{marginBottom: '1rem'}}><label>Nova Imagem (opcional):</label><input type="file" name="image" onChange={handleImageChange} accept="image/*" style={{color: 'var(--cor-texto-secundaria)'}}/></div>
          <div>
            <button type="submit" className="btn-add">Salvar Alterações</button>
            <button type="button" onClick={onClose} style={{ marginLeft: '10px' }}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProductModal;
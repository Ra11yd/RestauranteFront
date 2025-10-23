import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import AddProductForm from '../components/AddProductForm';
import EditProductModal from '../components/EditProductModal';
import './Admin.css';

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.companyId) return;
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          api.get('/products', { params: { companyId: user.companyId } }),
          api.get('/categories', { params: { companyId: user.companyId } })
        ]);
        setProducts(productsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) { console.error("Erro ao buscar dados:", error); }
    };
    fetchData();
  }, [user]);

  const handleDelete = async (productId) => {
    if (window.confirm("Tem certeza de que deseja excluir este produto?")) {
      try {
        await api.delete(`/products/${productId}`, { data: { companyId: user.companyId } });
        setProducts(p => p.filter(prod => prod._id !== productId));
        alert("Produto excluído com sucesso!");
      } catch (error) { alert("Não foi possível excluir o produto."); }
    }
  };
  
  const handleProductAdded = (newProduct) => {
    setProducts(p => [newProduct, ...p].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  const handleEditClick = (product) => setEditingProduct(product);
  const handleCloseModal = () => setEditingProduct(null);
  const handleProductUpdated = (updatedProduct) => {
    setProducts(p => p.map(prod => prod._id === updatedProduct._id ? updatedProduct : prod));
  };

  return (
    <div className="admin-container">
      <Link to="/admin">← Voltar para o Painel Principal</Link>
      <h1 className="admin-header" style={{ marginTop: '20px' }}>Gerenciar Produtos</h1>

      <div className="admin-form-container">
        <AddProductForm 
          categories={categories} 
          onProductAdded={handleProductAdded} 
          companyId={user?.companyId} 
        />
      </div>

      <h2 style={{ marginTop: '2rem' }}>Produtos Existentes</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Imagem</th>
            <th>Nome do Produto</th>
            <th>Categoria</th>
            <th>Preço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id}>
              <td>
                {product.imageUrl && <img src={product.imageUrl} alt={product.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />}
              </td>
              <td style={{color: 'white'}}>{product.name}</td>
              <td>{product.category?.name || <span style={{color: 'red'}}>Sem Categoria</span>}</td>
              <td>R$ {product.price.toFixed(2).replace('.', ',')}</td>
              <td style={{textAlign: 'center'}}>
                <button onClick={() => handleEditClick(product)} className="action-btn btn-edit">Editar</button>
                <button onClick={() => handleDelete(product._id)} className="action-btn btn-delete">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <EditProductModal 
        product={editingProduct}
        categories={categories}
        onClose={handleCloseModal}
        onProductUpdated={handleProductUpdated}
      />
    </div>
  );
}

export default AdminProductsPage;
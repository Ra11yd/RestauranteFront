import React from 'react';
import ProductCard from './ProductCard';

function ProductList({ allProducts = [], categoryId, onAddToCart, categories = [] }) {
  
  // Filtra a lista completa de produtos para mostrar apenas os da categoria selecionada
  const productsToDisplay = allProducts.filter(p => p.category?._id === categoryId);
  
  // Encontra o nome da categoria atual para exibir o título
  const currentCategory = categories.find(c => c._id === categoryId);

  return (
    <section className="secao-produtos">
      {currentCategory && <h2>{currentCategory.name}</h2>}
      
      <div className="product-list-container">
        {productsToDisplay.length > 0 ? (
          productsToDisplay.map(product => (
            <ProductCard 
              key={product._id} 
              product={product} 
              onAddToCart={onAddToCart} 
            />
          ))
        ) : (
          <p style={{color: 'var(--cor-texto-secundaria)', gridColumn: '1 / -1', textAlign: 'center'}}>Nenhum produto encontrado nesta categoria.</p>
        )}
      </div>
    </section>
  );
}

export default ProductList;
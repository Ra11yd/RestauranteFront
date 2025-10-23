import React, { useState, useEffect } from 'react';

function ProductCard({ product, onAddToCart }) {
  // Estado para guardar as quantidades de cada adicional
  const [addOnQuantities, setAddOnQuantities] = useState({});
  
  const [totalPrice, setTotalPrice] = useState(product.price);
  const [observation, setObservation] = useState('');

  // Efeito que recalcula o preço total sempre que as quantidades de adicionais mudam
  useEffect(() => {
    let addOnsPrice = 0;
    for (const addOnId in addOnQuantities) {
      const quantity = addOnQuantities[addOnId];
      if (quantity > 0) {
        const addOn = product.addOns.find(a => a._id === addOnId);
        if (addOn && addOn.price) { // Garante que o adicional e seu preço existem
          addOnsPrice += addOn.price * quantity;
        }
      }
    }
    setTotalPrice(product.price + addOnsPrice);
  }, [addOnQuantities, product.price, product.addOns]);

  // Funções para aumentar e diminuir a quantidade de um adicional
  const handleAddOnQuantityChange = (addOnId, delta) => {
    setAddOnQuantities(prevQtys => {
      const currentQty = prevQtys[addOnId] || 0;
      const newQty = Math.max(0, currentQty + delta); // Garante que a quantidade não seja negativa
      
      const newQuantities = { ...prevQtys };
      if (newQty === 0) {
        delete newQuantities[addOnId]; // Remove o adicional do objeto se a quantidade for zerada
      } else {
        newQuantities[addOnId] = newQty;
      }
      return newQuantities;
    });
  };

  const handleAddToCartClick = () => {
    const trimmedObservation = observation.trim();
    
    // Constrói a lista de adicionais selecionados, incluindo suas quantidades
    const selectedAddOnsWithQty = Object.entries(addOnQuantities)
      .map(([addOnId, quantity]) => {
        const addOn = product.addOns.find(a => a._id === addOnId);
        if (addOn) {
          return { ...addOn, quantity };
        }
        return null;
      })
      .filter(Boolean); // Filtra qualquer item nulo (caso um adicional não seja encontrado)

    const itemForCart = {
      ...product,
      price: totalPrice,
      selectedAddOns: selectedAddOnsWithQty,
      observation: trimmedObservation,
      // Cria um ID único para o carrinho que considera as quantidades dos adicionais e a observação
      cartItemId: product._id + JSON.stringify(addOnQuantities) + (trimmedObservation ? `_obs_${trimmedObservation}` : '')
    };
    onAddToCart(itemForCart);

    // Limpa os campos após adicionar o item ao carrinho
    setAddOnQuantities({});
    setObservation('');
  };

  return (
    <div className="item-cardapio">
      {product.imageUrl && <img src={product.imageUrl} alt={product.name} />}
      <h3>{product.name}</h3>
      <p className="descricao">{product.description}</p>
      
      {product.addOns && product.addOns.length > 0 && (
        <div className="adicionais-container" style={{ textAlign: 'left', fontSize: '0.9rem', marginBottom: '1rem', borderTop: '1px solid var(--cor-borda-cinza)', paddingTop: '1rem' }}>
          <strong style={{color: 'var(--cor-secundaria-amarelo)'}}>Adicionais:</strong>
          {product.addOns.map(addOn => (
            <div key={addOn._id} className="adicional-item">
              <span>{addOn.name} (+ R$ {(addOn.price || 0).toFixed(2).replace('.', ',')})</span>
              <div className="adicional-controles">
                <button onClick={() => handleAddOnQuantityChange(addOn._id, -1)}>-</button>
                <span className="quantidade-adicional">{addOnQuantities[addOn._id] || 0}</span>
                <button onClick={() => handleAddOnQuantityChange(addOn._id, 1)}>+</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="opcao-grupo" style={{textAlign: 'left', marginTop: 'auto'}}>
          <label htmlFor={`obs-${product._id}`}>Observações:</label>
          <input 
            type="text" 
            id={`obs-${product._id}`}
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            placeholder="Ex: sem cebola, ponto da carne..."
          />
      </div>

      <p className="preco">R$ {totalPrice.toFixed(2).replace('.', ',')}</p>
      <button onClick={handleAddToCartClick} className="adicionar-btn">
        Adicionar ao 🛒
      </button>
    </div>
  );
}

export default ProductCard;
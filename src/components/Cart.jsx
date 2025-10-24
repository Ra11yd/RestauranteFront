import React from 'react';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import CustomerAuthLinks from './CustomerAuthLinks';

function Cart({ cartItems, onClose, deliveryFee = 0, onUpdateQuantity, onDeleteItem }) {
  const itemsTotal = cartItems.reduce((sum, item) => (sum + (item.price * item.quantity)), 0);
  const finalTotal = itemsTotal + deliveryFee;

  return (
    <div>
      {/* --- LINKS DE AUTENTICAÇÃO ADICIONADOS AQUI --- */}
      <div style={{ padding: '0 0 1.5rem 0', borderBottom: '1px solid var(--cor-borda-cinza)', marginBottom: '1.5rem' }}>
        <CustomerAuthLinks />
      </div>
      
      <h3 style={{ textAlign: 'center', fontSize: '1.5rem', marginBottom: '1.5rem' }}>Seu Carrinho</h3>
      
      {cartItems.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888', marginTop: '2rem' }}>O carrinho está vazio.</p>
      ) : (
        <ul id="lista-carrinho">
          {cartItems.map(item => (
            <li key={item.cartItemId}>
              <span className="nome-produto">{item.name}</span>
              
              <div className="item-detalhes-carrinho">
                {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                  <div style={{marginBottom: '4px'}}>
                    <strong>Adicionais:</strong> {item.selectedAddOns.map(addOn => `${addOn.quantity}x ${addOn.name}`).join(', ')}
                  </div>
                )}
                {item.observation && (
                  <div>
                    <strong>Obs:</strong> {item.observation}
                  </div>
                )}
              </div>

              <span className="preco-produto" style={{textAlign: 'right', marginTop: '8px', color: 'white'}}>
                {item.quantity} x R$ {item.price.toFixed(2).replace('.', ',')} = 
                <strong> R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</strong>
              </span>

              <div className="quantidade-controle">
                <button onClick={() => onUpdateQuantity(item.cartItemId, -1)} aria-label={`Diminuir quantidade de ${item.name}`}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => onUpdateQuantity(item.cartItemId, 1)} aria-label={`Aumentar quantidade de ${item.name}`}>+</button>
                <button className="remover-btn" onClick={() => onDeleteItem(item.cartItemId)}>Remover</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {cartItems.length > 0 && (
        <div style={{marginTop: '1.5rem', textAlign: 'right', borderTop: '1px solid #444', paddingTop: '1rem'}}>
            <p>Total dos Itens: R$ {itemsTotal.toFixed(2).replace('.', ',')}</p>
            <p>Taxa de Entrega: R$ {deliveryFee.toFixed(2).replace('.', ',')}</p>
            <p id="total-carrinho">
              Total do Pedido: R$ {finalTotal.toFixed(2).replace('.', ',')}
            </p>
        </div>
      )}
      
      {/* O CheckoutForm será renderizado pela StorePage/SalonPage abaixo deste componente */}
      
      <button onClick={onClose} className="btn-fechar-carrinho" style={{width: '100%', marginTop: '1rem', border: 'none'}}>
        Fechar Carrinho
      </button>
    </div>
  );
}

export default Cart;

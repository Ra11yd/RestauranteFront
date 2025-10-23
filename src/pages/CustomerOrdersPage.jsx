import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { useCart } from '../context/CartContext';
import './Admin.css'; // Reutiliza os estilos do admin para os cards

function CustomerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { customerToken, isAuthenticated } = useCustomerAuth();
  const navigate = useNavigate();
  const { setCart } = useCart();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await api.get('/customer/orders', {
          headers: { 'x-customer-auth-token': customerToken }
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Erro ao buscar histórico de pedidos", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [isAuthenticated, customerToken]);

  const handleRepeatOrder = (order) => {
    // 1. Extrai todos os detalhes do pedido antigo
    const itemsToRepeat = order.items.map(oldItem => {
      if (!oldItem.product) return null; // Se o produto foi deletado, ignora

      const details = oldItem.details || '';
      const obsMatch = details.match(/Obs: (.*?)(;|$)/);
      const observation = obsMatch ? obsMatch[1].trim() : '';
      
      let selectedAddOns = [];
      let addOnsPrice = 0;
      const addOnsMatch = details.match(/Adicionais: (.*)/);
      if (addOnsMatch) {
        const addOnsText = addOnsMatch[1].split(';')[0].trim();
        const oldAddOns = addOnsText.split(', ').map(nameWithQty => {
            const parts = nameWithQty.split('x ');
            return {
              quantity: parseInt(parts[0], 10) || 1,
              name: parts.length > 1 ? parts[1] : parts[0]
            };
        });
        
        selectedAddOns = oldItem.product.addOns
          .filter(currentAddOn => oldAddOns.some(oldAddOn => oldAddOn.name === currentAddOn.name))
          .map(currentAddOn => {
              const oldAddOn = oldAddOns.find(o => o.name === currentAddOn.name);
              const quantity = oldAddOn.quantity;
              addOnsPrice += (currentAddOn.price * quantity);
              return { ...currentAddOn, quantity: quantity };
          });
      }

      return {
        ...oldItem.product,
        quantity: oldItem.quantity,
        price: oldItem.product.price + addOnsPrice,
        selectedAddOns: selectedAddOns,
        observation: observation,
        cartItemId: oldItem.product._id + Date.now() + Math.random()
      };
    }).filter(Boolean);

    if (itemsToRepeat.length === 0) {
      return alert("Nenhum dos itens deste pedido está disponível atualmente.");
    }
    if (itemsToRepeat.length < order.items.length) {
      alert("Atenção: alguns produtos deste pedido não estão mais disponíveis e foram removidos.");
    }

    const slug = order.companyId.slug;
    localStorage.setItem(`cart-${slug}`, JSON.stringify(itemsToRepeat));
    setCart(itemsToRepeat);
    navigate(`/loja/${slug}`);
  };

  if (loading) return <div className="admin-container"><p>Carregando seus pedidos...</p></div>;
  if (!isAuthenticated) return <div className="admin-container"><p>Você precisa estar logado para ver seus pedidos.</p></div>;

  return (
    <div className="admin-container">
      <h2 className="admin-header">Meus Pedidos</h2>
      {orders.length === 0 ? (
        <p style={{textAlign: 'center'}}>Você ainda não fez nenhum pedido.</p>
      ) : (
        orders.map(order => (
          <div key={order._id} className="order-card" style={{borderLeftColor: '#00BFFF'}}>
            <div style={{borderBottom: '1px solid var(--cor-borda-cinza)', paddingBottom: '1rem', marginBottom: '1rem'}}>
              <p><strong>Pedido de:</strong> {new Date(order.createdAt).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><strong>Status:</strong> {order.status}</p>
            </div>
            
            <div>
                {order.orderType === 'salon' ? (<p><strong>Mesa:</strong> {order.tableName}</p>) : (
                  <>
                    <p><strong>Contato:</strong> {order.customerPhone}</p>
                    <p><strong>Endereço:</strong> {order.customerAddress}</p>
                    <p><strong>Bairro:</strong> {order.customerNeighborhood}</p>
                  </>
                )}
                <p><strong>Forma de Pagamento:</strong> {order.paymentMethod}</p>
                {order.paymentMethod === 'Dinheiro' && order.changeFor > 0 && (
                  <p><strong>Troco para: R$ {parseFloat(order.changeFor).toFixed(2).replace('.', ',')}</strong></p>
                )}
                <h4>Itens do Pedido:</h4>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.quantity}x {item.productName || item.product?.name || '(Item Removido)'}
                      {item.details && <span style={{fontSize: '0.8rem', color: '#aaa', display: 'block', marginLeft: '10px'}}>↳ {item.details}</span>}
                    </li>
                  ))}
                </ul>
                {order.orderType === 'delivery' && (
                  <p><strong>Taxa de Entrega:</strong> R$ {order.deliveryFee.toFixed(2).replace('.', ',')}</p>
                )}
                <p className="total-price">Total do Pedido: R$ {order.total.toFixed(2).replace('.', ',')}</p>
                <div className="order-actions" style={{marginTop: '1rem'}}>
                    <button onClick={() => handleRepeatOrder(order)} className="btn-add">Repetir Pedido</button>
                </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
export default CustomerOrdersPage;
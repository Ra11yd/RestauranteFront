// src/pages/ComandaPrintPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';

function ComandaPrintPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/orders/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        console.error("Erro ao buscar pedido:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  // Efeito para chamar a impressão quando os dados carregarem
  useEffect(() => {
    if (order && !loading) {
      window.print();
    }
  }, [order, loading]);

  if (loading) return <p>Carregando comanda...</p>;
  if (!order) return <p>Pedido não encontrado.</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', color: 'black' }}>
      <h2>Comanda - Pedido de: {order.customerName}</h2>
      <p>Recebido em: {new Date(order.createdAt).toLocaleString('pt-BR')}</p>
      <hr style={{margin: '10px 0', borderStyle: 'dashed'}} />
      <p><strong>Contato:</strong> {order.customerPhone}</p>
      <p><strong>Endereço:</strong> {order.customerAddress}, {order.customerNeighborhood}</p>
      <p><strong>Pagamento:</strong> {order.paymentMethod}</p>
      {order.changeFor > 0 && <p><strong>Troco para:</strong> R$ {order.changeFor.toFixed(2)}</p>}
      <hr style={{margin: '10px 0', borderStyle: 'dashed'}} />
      <h3>Itens:</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {order.items.map(item => (
          <li key={item.product?._id || item.price} style={{ marginBottom: '5px' }}>
            <strong>{item.quantity}x {item.product?.name || '(Produto Removido)'}</strong>
            {item.details && <div style={{ fontSize: '0.9em', paddingLeft: '10px' }}><em>↳ {item.details}</em></div>}
          </li>
        ))}
      </ul>
      <hr style={{margin: '10px 0', borderStyle: 'dashed'}} />
      <p><strong>Taxa de Entrega:</strong> R$ {order.deliveryFee.toFixed(2)}</p>
      <h3 style={{marginTop: '10px'}}>TOTAL: R$ {order.total.toFixed(2)}</h3>
    </div>
  );
}

export default ComandaPrintPage;
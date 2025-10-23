import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import '../index.css'; // Reutiliza os estilos da loja

function OrderStatusPage() {
  const { trackingId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Usamos useRef para guardar o status anterior sem causar re-renderizações extras
  const previousStatusRef = useRef(null);

  useEffect(() => {
    // Passo 1: Pedir permissão para notificações assim que a página carregar
    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }

    const fetchOrder = async () => {
      try {
        const response = await api.get(`/public/order/${trackingId}`);
        
        // Passo 2: Checar se o status mudou antes de atualizar o estado
        if (previousStatusRef.current && response.data.status !== previousStatusRef.current) {
          // Se mudou, mostra a notificação!
          showNotification(response.data.status);
        }
        
        setOrder(response.data);
        // Atualiza o status anterior para a próxima verificação
        previousStatusRef.current = response.data.status;

      } catch (err) {
        setError("Pedido não encontrado ou inválido.");
        // Se der erro, para de verificar
        if (intervalId) clearInterval(intervalId);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder(); // Busca inicial
    const intervalId = setInterval(fetchOrder, 15000); // Continua verificando a cada 15 segundos

    // Limpa o intervalo quando o componente é desmontado (quando o usuário fecha a aba)
    return () => clearInterval(intervalId);
  }, [trackingId]);
  
  // Passo 3: Função que cria e exibe a notificação
  const showNotification = (status) => {
    if (!("Notification" in window) || Notification.permission !== "granted") {
      return; // Não faz nada se as notificações não forem permitidas
    }

    const title = 'Atualização do seu Pedido!';
    let body = '';

    switch(status) {
        case 'Em preparação': body = 'Seu pedido começou a ser preparado!'; break;
        case 'Pronto para retirar': body = 'Seu pedido está pronto para retirada!'; break;
        case 'Saiu para entrega': body = 'Oba! Seu pedido já está a caminho!'; break;
        case 'Finalizado': body = 'Seu pedido foi entregue/finalizado. Bom apetite!'; break;
        default: return; // Não notifica para outros status como 'Pendente' ou 'Cancelado'
    }

    // Cria a notificação
    const notification = new Notification(title, {
      body: body,
      icon: '/logo.png' // Lembre-se de ter um logo.png na sua pasta `public` do front-end
    });
  };

  const getStatusDescription = (status) => {
      switch(status) {
          case 'Pendente': return 'Seu pedido foi recebido e está na fila para ser preparado.';
          case 'Em preparação': return 'Nosso chef já está preparando seu pedido com muito carinho!';
          case 'Pronto para retirar': return 'Seu pedido está pronto e aguardando para ser retirado no balcão!';
          case 'Saiu para entrega': return 'Seu pedido já saiu e logo chegará até você!';
          case 'Finalizado': return 'Seu pedido foi finalizado. Esperamos que goste, bom apetite!';
          case 'Cancelado': return 'Infelizmente seu pedido foi cancelado.';
          default: return 'Status desconhecido.';
      }
  }

  if (loading) return <div style={{textAlign: 'center', color: 'white', marginTop: '3rem'}}><h2>Carregando status do pedido...</h2></div>;
  if (error) return <div style={{textAlign: 'center', color: 'red', marginTop: '3rem'}}><h2>{error}</h2></div>;
  if (!order) return null; // Não renderiza nada se o pedido ainda não carregou

  return (
    <div style={{
      maxWidth: '600px', 
      margin: '2rem auto', 
      padding: '2rem', 
      backgroundColor: 'var(--cor-card-fundo)', 
      borderRadius: '8px',
      color: 'var(--cor-texto-claro)',
      border: '1px solid var(--cor-borda-cinza)'
    }}>
      <h1 style={{color: 'var(--cor-secundaria-amarelo)', textAlign: 'center'}}>Acompanhe seu Pedido</h1>
      <p style={{textAlign: 'center', color: 'var(--cor-texto-secundaria)'}}>Olá, {order.customerName}!</p>

      <div style={{marginTop: '2rem', textAlign: 'center'}}>
        <p>Status atual:</p>
        <h2 style={{color: 'var(--cor-secundaria-amarelo)', fontSize: '2rem', margin: '0.5rem 0'}}>{order.status}</h2>
        <p style={{color: 'var(--cor-texto-secundaria)'}}>{getStatusDescription(order.status)}</p>
      </div>
      
      <div style={{marginTop: '2rem', borderTop: '1px solid var(--cor-borda-cinza)', paddingTop: '1rem'}}>
          <h4>Resumo do Pedido:</h4>
          <ul style={{listStyle: 'none', padding: 0, marginTop: '1rem'}}>
            {order.items.map((item, index) => (
                <li key={index} style={{marginBottom: '0.5rem', color: 'var(--cor-texto-secundaria)'}}>
                    {item.quantity}x {item.product ? item.product.name : '(Produto indisponível)'}
                </li>
            ))}
          </ul>
          <p style={{textAlign: 'right', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '1rem', color: 'var(--cor-secundaria-amarelo)'}}>
              Total: R$ {order.total.toFixed(2).replace('.', ',')}
          </p>
          <small style={{display: 'block', textAlign: 'center', color: '#888', marginTop: '2rem'}}>
              Pedido feito em: {new Date(order.createdAt).toLocaleString('pt-BR')}
          </small>
      </div>
    </div>
  );
}

export default OrderStatusPage;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import './Admin.css';

function AdminPage() {
  const [allOrders, setAllOrders] = useState([]);
  const [ordersToDisplay, setOrdersToDisplay] = useState([]);
  const [settings, setSettings] = useState(null);
  const [stats, setStats] = useState({
    todayCount: 0, todaySum: 0,
    weekCount: 0, weekSum: 0,
    monthCount: 0, monthSum: 0,
    periodCount: 0, periodSum: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDates, setFilterDates] = useState({ start: '', end: '' });
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [isFilterActive, setIsFilterActive] = useState(false);
  const { user } = useAuth();
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    if (user?.companyId) {
      fetchInitialData();
    }
  }, [user]);

  const fetchInitialData = async () => {
    try {
      const [ordersRes, settingsRes] = await Promise.all([
        api.get('/orders', { params: { companyId: user.companyId } }),
        api.get('/settings', { params: { companyId: user.companyId } })
      ]);
      const sortedOrders = ordersRes.data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAllOrders(sortedOrders);
      setOrdersToDisplay(sortedOrders);
      setSettings(settingsRes.data);
    } catch (error) { console.error("Erro ao buscar dados:", error); }
  };

  useEffect(() => {
    const deliveredOrders = allOrders.filter(order => order.status === 'Entregue' || order.status === 'Finalizado');
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const todayDelivered = deliveredOrders.filter(o => new Date(o.createdAt) >= startOfToday);
    const weekDelivered = deliveredOrders.filter(o => new Date(o.createdAt) >= startOfWeek);
    const monthDelivered = deliveredOrders.filter(o => new Date(o.createdAt) >= startOfMonth);
    const todaySum = todayDelivered.reduce((s, o) => s + o.total, 0);
    const weekSum = weekDelivered.reduce((s, o) => s + o.total, 0);
    const monthSum = monthDelivered.reduce((s, o) => s + o.total, 0);
    setStats({ todayCount: todayDelivered.length, todaySum, weekCount: weekDelivered.length, weekSum, monthCount: monthDelivered.length, monthSum, periodCount: 0, periodSum: 0 });
  }, [allOrders]);

  const handleFilter = () => {
    setIsFilterActive(true);
    let filtered = [...allOrders];
    if (statusFilter !== 'Todos') {
      if (statusFilter === 'Pedidos do Salão') {
        filtered = filtered.filter(order => order.orderType === 'salon');
      } else if (statusFilter === 'Pedidos de Delivery') {
        filtered = filtered.filter(order => order.orderType === 'delivery');
      } else {
        filtered = filtered.filter(order => order.status === statusFilter);
      }
    }
    if (searchTerm) {
      filtered = filtered.filter(order => order.customerName.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (filterDates.start && filterDates.end) {
      const startDate = new Date(filterDates.start);
      const endDate = new Date(new Date(filterDates.end).setHours(23, 59, 59, 999));
      filtered = filtered.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate >= startDate && orderDate <= endDate;
      });
    }
    setOrdersToDisplay(filtered);
    const deliveredInPeriod = filtered.filter(o => o.status === 'Entregue' || o.status === 'Finalizado');
    const totalSumInPeriod = deliveredInPeriod.reduce((sum, order) => sum + order.total, 0);
    const totalCountInPeriod = deliveredInPeriod.length;
    setStats(prevStats => ({ ...prevStats, periodSum: totalSumInPeriod, periodCount: totalCountInPeriod }));
  };

  const handleClearFilter = () => {
    setIsFilterActive(false);
    setSearchTerm('');
    setFilterDates({ start: '', end: '' });
    setStatusFilter('Todos');
    setOrdersToDisplay(allOrders);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await api.patch(`/orders/${orderId}/status`, { status: newStatus, companyId: user.companyId });
      const updatedOrders = allOrders.map(o => (o._id === response.data._id ? response.data : o));
      setAllOrders(updatedOrders);
      setOrdersToDisplay(updatedOrders);
    } catch (error) { alert("Não foi possível atualizar o status."); }
  };
  
  const handleCancelOrder = (orderId) => { if (window.confirm("Certeza?")) { handleUpdateStatus(orderId, 'Cancelado'); } };
  
  const handleNotifyClient = (order) => {
    const phone = order.customerPhone.replace(/\D/g, '');
    const message = settings?.whatsappMessage || "Olá, seu pedido está a caminho! :)";
    window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };
  
  const handlePrintOrder = (orderId) => {
    window.open(`/admin/comanda/${orderId}`, '_blank');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendente': return '#FFA500'; case 'Em preparação': return '#1E90FF';
      case 'Saiu para entrega': return '#32CD32'; case 'Pronto para retirar': return '#9C27B0';
      case 'Entregue': return '#777'; case 'Finalizado': return '#4CAF50';
      case 'Cancelado': return '#E53935'; default: return '#FFF';
    }
  };
  
  const handleToggleDetails = (orderId) => { setExpandedOrderId(expandedOrderId === orderId ? null : orderId); };

  return (
    <div className="admin-container">
      <h1 className="admin-header">Painel Principal</h1>
      
      {(user?.role === 'admin' || user?.role === 'superadmin') && (
        <div className="stats-container">
          {isFilterActive ? (
            <>
              <div className="stat-card"><h4>R$ {stats.periodSum.toFixed(2).replace('.',',')}</h4><p>Faturamento no Período</p></div>
              <div className="stat-card"><h4>{stats.periodCount}</h4><p>Pedidos Finalizados no Período</p></div>
            </>
          ) : (
            <>
              <div className="stat-card"><h4>R$ {stats.todaySum.toFixed(2).replace('.',',')}</h4><p>{stats.todayCount} Pedidos Finalizados Hoje</p></div>
              <div className="stat-card"><h4>R$ {stats.weekSum.toFixed(2).replace('.',',')}</h4><p>{stats.weekCount} Pedidos Finalizados na Semana</p></div>
              <div className="stat-card"><h4>R$ {stats.monthSum.toFixed(2).replace('.',',')}</h4><p>{stats.monthCount} Pedidos Finalizados no Mês</p></div>
            </>
          )}
        </div>
      )}

      <div className="admin-form-container">
        <h3>Filtrar Pedidos</h3>
        <div className="status-filter-buttons">
            <button onClick={() => setStatusFilter('Todos')} className={statusFilter === 'Todos' ? 'active' : ''}>Todos</button>
            <button onClick={() => setStatusFilter('Pendente')} className={statusFilter === 'Pendente' ? 'active' : ''}>Pendentes</button>
            <button onClick={() => setStatusFilter('Em preparação')} className={statusFilter === 'Em preparação' ? 'active' : ''}>Em Preparação</button>
            <button onClick={() => setStatusFilter('Finalizado')} className={statusFilter === 'Finalizado' ? 'active' : ''}>Finalizados</button>
            <button onClick={() => setStatusFilter('Cancelado')} className={statusFilter === 'Cancelado' ? 'active' : ''}>Cancelados</button>
            <button onClick={() => setStatusFilter('Pedidos do Salão')} className={statusFilter === 'Pedidos do Salão' ? 'active' : ''}>Salão</button>
            <button onClick={() => setStatusFilter('Pedidos de Delivery')} className={statusFilter === 'Pedidos de Delivery' ? 'active' : ''}>Delivery</button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', borderTop: '1px solid var(--cor-borda-cinza)', paddingTop: '1rem', marginTop: '1rem' }}>
          <input type="text" placeholder="Buscar por nome do cliente..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{flex: '1 1 200px'}} />
          <input type="date" value={filterDates.start} onChange={(e) => setFilterDates({...filterDates, start: e.target.value})} />
          <span>até</span>
          <input type="date" value={filterDates.end} onChange={(e) => setFilterDates({...filterDates, end: e.target.value})} />
          <div style={{marginLeft: 'auto', display: 'flex', gap: '1rem'}}>
            <button onClick={handleFilter} className="btn-add">Filtrar</button>
            <button onClick={handleClearFilter} className="action-btn" style={{backgroundColor: '#6c757d'}}>Limpar Filtro</button>
          </div>
        </div>
      </div>

      <h2>Pedidos Recebidos ({ordersToDisplay.length})</h2>
      {ordersToDisplay.length === 0 ? (<p>Nenhum pedido encontrado.</p>) : (
        <div>
          {ordersToDisplay.map(order => (
            <div key={order._id} className="order-card">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <h3>Pedido de: {order.customerName}</h3>
                  {order.orderType === 'salon' && <p style={{color: '#00BFFF', fontWeight: 'bold'}}><strong>Tipo:</strong> Pedido do Salão</p>}
                  {order.orderType === 'delivery' && <p style={{color: 'var(--cor-secundaria-amarelo)', fontWeight: 'bold'}}><strong>Tipo:</strong> Pedido de Delivery</p>}
                  <p><strong>Status: </strong><span className="status-text" style={{ backgroundColor: getStatusColor(order.status) }}>{order.status}</span></p>
                </div>
                <button onClick={() => handleToggleDetails(order._id)} className="action-btn" style={{backgroundColor: '#555'}}>
                  {expandedOrderId === order._id ? 'Ver Menos' : 'Ver Mais'}
                </button>
              </div>
              {expandedOrderId === order._id && (
                <div style={{marginTop: '1rem', borderTop: '1px solid var(--cor-borda-cinza)', paddingTop: '1rem'}}>
                  <p><strong>Nome:</strong> {order.customerName}</p>
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
                        {item.quantity}x {item.product?.name || '(PRODUTO EXCLUÍDO)'}
                        {item.details && <span style={{fontSize: '0.8rem', color: '#aaa', display: 'block', marginLeft: '10px'}}>↳ {item.details}</span>}
                      </li>
                    ))}
                  </ul>
                  {order.orderType === 'delivery' && (
                    <p><strong>Taxa de Entrega:</strong> R$ {order.deliveryFee.toFixed(2).replace('.', ',')}</p>
                  )}
                  <p className="total-price">Total do Pedido: R$ {order.total.toFixed(2).replace('.', ',')}</p>
                  <small>Recebido em: {new Date(order.createdAt).toLocaleString('pt-BR')}</small>
                  <div className="order-actions">
                    <strong>Ações:</strong><br/>
                    <button onClick={() => handlePrintOrder(order._id)} className="action-btn" style={{backgroundColor: '#007bff'}}>Imprimir Comanda</button>
                    {order.status !== 'Cancelado' && order.status !== 'Finalizado' && (
                      <>
                        <button onClick={() => handleUpdateStatus(order._id, 'Em preparação')}>Em preparação</button>
                        {order.orderType === 'delivery' && <button onClick={() => handleUpdateStatus(order._id, 'Saiu para entrega')}>Saiu para entrega</button>}
                        {order.orderType === 'salon' && <button onClick={() => handleUpdateStatus(order._id, 'Pronto para retirar')}>Pronto para retirar</button>}
                        <button onClick={() => handleUpdateStatus(order._id, 'Finalizado')}>Finalizado</button>
                      </>
                    )}
                    {order.status !== 'Cancelado' && order.status !== 'Finalizado' && (
                      <button onClick={() => handleCancelOrder(order._id)} style={{ backgroundColor: '#dc3545', marginLeft: '1rem' }}>Cancelar Pedido</button>
                    )}
                     {order.status === 'Saiu para entrega' && (
                      <button onClick={() => handleNotifyClient(order)} style={{ backgroundColor: '#25D366', color: 'white', fontWeight: 'bold', marginLeft: '1rem' }}>Notificar Cliente</button>
                     )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminPage;
import { Routes, Route } from 'react-router-dom';

// Importação dos Layouts e Páginas
import AdminLayout from './layouts/AdminLayout';
import StorePage from './pages/StorePage';
import SalonPage from './pages/SalonPage';
import AdminPage from './pages/AdminPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminCategoriesPage from './pages/AdminCategoriesPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import AdminDeliveryZonesPage from './pages/AdminDeliveryZonesPage';
import AdminTablesPage from './pages/AdminTablesPage';
import AdminEmployeesPage from './pages/AdminEmployeesPage';
import AdminAppearancePage from './pages/AdminAppearancePage';
import SuperAdminPage from './pages/SuperAdminPage';
import PixPage from './pages/PixPage';
import ComandaPrintPage from './pages/ComandaPrintPage';
import OrderStatusPage from './pages/OrderStatusPage';
import LoginPage from './pages/LoginPage';
import CustomerLoginPage from './pages/CustomerLoginPage';
import CustomerRegisterPage from './pages/CustomerRegisterPage';
import CustomerOrdersPage from './pages/CustomerOrdersPage';
import ProtectedRoute from './components/ProtectedRoute';
import SuperAdminRoute from './components/SuperAdminRoute';

function App() {
  return (
    // O <Router> foi removido daqui
    <Routes>
      {/* --- Rotas Públicas --- */}
      <Route path="/loja/:slug" element={<StorePage />} />
      <Route path="/salao/:slug" element={<SalonPage />} />
      <Route path="/pagar-pix" element={<PixPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/pedido/:trackingId" element={<OrderStatusPage />} />
      
      {/* --- Rotas de Cliente --- */}
      <Route path="/login/:slug" element={<CustomerLoginPage />} />
      <Route path="/cadastro/:slug" element={<CustomerRegisterPage />} />
      <Route path="/meus-pedidos" element={<CustomerOrdersPage />} />
      
      {/* --- Grupo de Rotas de Admin (Protegidas) --- */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
          <Route path="/admin/delivery-zones" element={<AdminDeliveryZonesPage />} />
          <Route path="/admin/tables" element={<AdminTablesPage />} />
          <Route path="/admin/employees" element={<AdminEmployeesPage />} />
          <Route path="/admin/appearance" element={<AdminAppearancePage />} />
        </Route>
        <Route path="/admin/comanda/:orderId" element={<ComandaPrintPage />} />
      </Route>

      {/* --- Grupo de Rotas de Super Admin (Protegidas) --- */}
      <Route element={<SuperAdminRoute />}>
          <Route path="/super-admin" element={<SuperAdminPage />} />
      </Route>
    </Routes>
  );
}

export default App;
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import OverviewPage from './pages/dashboard/OverviewPage';
import MealsPage from './pages/dashboard/MealsPage';
import OrdersPage from './pages/dashboard/OrdersPage';
import SubscriptionsPage from './pages/dashboard/SubscriptionsPage';
import WebsitePage from './pages/dashboard/WebsitePage';
import StorefrontPage from './pages/storefront/StorefrontPage';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      {/* Storefront (public) */}
      <Route path="/store/:subdomain" element={<StorefrontPage />} />

      {/* Admin Dashboard (protected) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredRole="admin">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<OverviewPage />} />
        <Route path="meals" element={<MealsPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="subscriptions" element={<SubscriptionsPage />} />
        <Route path="website" element={<WebsitePage />} />
      </Route>
    </Routes>
  );
}

export default App;

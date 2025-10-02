import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import LandingPage from './pages/LandingPage';
import InvoiceCreatePage from './pages/InvoiceCreatePage';
import InvoiceViewPage from './pages/InvoiceViewPage';
// Temporary import for admin user creation - remove after setup
import { createAdminUser } from './utils/createAdmin';

// Make createAdminUser available globally for development
if (import.meta.env.DEV) {
  (window as any).createAdminUser = createAdminUser;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/invoice/create" element={<InvoiceCreatePage />} />
          <Route path="/create" element={<InvoiceCreatePage />} />
          <Route path="/invoice/:slug" element={<InvoiceViewPage />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Redirect /admin to /admin/dashboard */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

          {/* 404 - catch all */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
                <p className="text-gray-600">The page you're looking for doesn't exist.</p>
              </div>
            </div>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

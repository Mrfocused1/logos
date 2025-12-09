import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import DashboardHome from './DashboardHome';
import InvoicesPage from './InvoicesPage';
import MenuLinksPage from './MenuLinksPage';

const DashboardPage: React.FC = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<DashboardHome />} />
        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="invoices" element={<InvoicesPage />} />
        <Route path="menu-links" element={<MenuLinksPage />} />
      </Routes>
    </AdminLayout>
  );
};

export default DashboardPage;
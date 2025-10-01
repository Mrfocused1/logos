import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import DashboardHome from './DashboardHome';
import InvoicesPage from './InvoicesPage';
// Import other admin pages when created
// import TestimonialsPage from './TestimonialsPage';

const DashboardPage: React.FC = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<DashboardHome />} />
        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="invoices" element={<InvoicesPage />} />
        {/* Future routes will be added here */}
        {/* <Route path="testimonials" element={<TestimonialsPage />} /> */}
      </Routes>
    </AdminLayout>
  );
};

export default DashboardPage;
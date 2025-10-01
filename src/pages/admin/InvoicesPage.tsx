import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Trash2,
  FileText,
  Calendar,
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { Button, GlassCard, Input, Squares, InteractiveHoverButton } from '../../components/ui';
import type { InvoiceData } from '../../types/invoice';
import { formatCurrency, formatDate, isOverdue, generateInvoiceUrl } from '../../utils/invoice';
import { INVOICE_STATUS_COLORS } from '../../types/invoice';

const InvoicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'client'>('date');

  // Mock invoice data - in real app, fetch from API/database
  const mockInvoices: InvoiceData[] = [
    {
      id: 'invoice-1',
      invoiceNumber: 'BL-202501-001',
      customSlug: 'acme-corp-logo-design',
      clientName: 'Acme Corporation',
      clientEmail: 'contact@acme-corp.com',
      issueDate: '2025-01-15',
      dueDate: '2025-02-14',
      status: 'sent',
      items: [],
      subtotal: 750.00,
      taxRate: 20,
      taxAmount: 150.00,
      total: 900.00,
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-01-15T10:00:00Z',
      createdBy: 'admin'
    },
    {
      id: 'invoice-2',
      invoiceNumber: 'BL-202501-002',
      customSlug: 'tech-startup-branding',
      clientName: 'TechStart Solutions',
      clientEmail: 'hello@techstart.io',
      issueDate: '2025-01-10',
      dueDate: '2025-01-25',
      status: 'overdue',
      items: [],
      subtotal: 1200.00,
      taxRate: 20,
      taxAmount: 240.00,
      total: 1440.00,
      createdAt: '2025-01-10T14:30:00Z',
      updatedAt: '2025-01-10T14:30:00Z',
      createdBy: 'admin'
    },
    {
      id: 'invoice-3',
      invoiceNumber: 'BL-202501-003',
      customSlug: 'local-bakery-package',
      clientName: 'Sweet Dreams Bakery',
      clientEmail: 'orders@sweetdreams.co.uk',
      issueDate: '2025-01-12',
      dueDate: '2025-02-11',
      status: 'paid',
      items: [],
      subtotal: 450.00,
      taxRate: 20,
      taxAmount: 90.00,
      total: 540.00,
      createdAt: '2025-01-12T09:15:00Z',
      updatedAt: '2025-01-20T16:45:00Z',
      createdBy: 'admin'
    },
    {
      id: 'invoice-4',
      invoiceNumber: 'BL-202501-004',
      customSlug: 'consulting-firm-rebrand',
      clientName: 'Strategic Consulting Ltd',
      clientEmail: 'admin@strategic.consulting',
      issueDate: '2025-01-18',
      dueDate: '2025-02-17',
      status: 'draft',
      items: [],
      subtotal: 2500.00,
      taxRate: 20,
      taxAmount: 500.00,
      total: 3000.00,
      createdAt: '2025-01-18T11:20:00Z',
      updatedAt: '2025-01-18T11:20:00Z',
      createdBy: 'admin'
    }
  ];

  const [invoices] = useState<InvoiceData[]>(mockInvoices);

  // Filter and sort invoices
  const filteredInvoices = invoices
    .filter(invoice => {
      const matchesSearch =
        invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.clientEmail.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return b.total - a.total;
        case 'client':
          return a.clientName.localeCompare(b.clientName);
        case 'date':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  // Calculate stats
  const stats = {
    total: invoices.length,
    sent: invoices.filter(i => i.status === 'sent').length,
    paid: invoices.filter(i => i.status === 'paid').length,
    overdue: invoices.filter(i => isOverdue(i.dueDate, i.status)).length,
    totalAmount: invoices.reduce((sum, i) => sum + i.total, 0),
    paidAmount: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0)
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'sent':
        return <Clock size={16} className="text-blue-600" />;
      case 'overdue':
        return <AlertCircle size={16} className="text-red-600" />;
      case 'draft':
        return <XCircle size={16} className="text-gray-400" />;
      default:
        return <FileText size={16} className="text-gray-400" />;
    }
  };

  const handleViewInvoice = (slug: string) => {
    const url = generateInvoiceUrl(slug);
    window.open(url, '_blank');
  };

  const handleCopyUrl = (slug: string) => {
    const url = generateInvoiceUrl(slug);
    navigator.clipboard.writeText(url);
    // In real app, show toast notification
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
  };

  return (
    <div className="relative">
      {/* Animated Grid Background - positioned to cover the admin content area */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Squares
          direction="diagonal"
          speed={0.3}
          borderColor="rgba(0, 0, 0, 0.025)"
          squareSize={40}
          hoverFillColor="rgba(0, 0, 0, 0.015)"
        />
      </div>

      <div className="relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
          >
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold font-heading text-black mb-1">INVOICES</h1>
              <p className="text-lg text-black font-bold">Manage and track your client invoices</p>
            </div>
            <InteractiveHoverButton
              text="Create Invoice"
              onClick={() => navigate('/invoice/create')}
              className="w-48 h-12 text-black border-black"
            />
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
          >
            <GlassCard className="p-6 bg-white/90 backdrop-blur-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Invoices</p>
                  <p className="text-2xl font-bold text-black">{stats.total}</p>
                </div>
                <div className="p-3 rounded-xl bg-black/10">
                  <FileText className="w-6 h-6 text-black" />
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6 bg-white/90 backdrop-blur-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Paid Invoices</p>
                  <p className="text-2xl font-bold text-black">{stats.paid}</p>
                </div>
                <div className="p-3 rounded-xl bg-green-100">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6 bg-white/90 backdrop-blur-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-black">{formatCurrency(stats.totalAmount)}</p>
                </div>
                <div className="p-3 rounded-xl bg-black/10">
                  <DollarSign className="w-6 h-6 text-black" />
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6 bg-white/90 backdrop-blur-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Paid Revenue</p>
                  <p className="text-2xl font-bold text-black">{formatCurrency(stats.paidAmount)}</p>
                </div>
                <div className="p-3 rounded-xl bg-green-100">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Filters and Search */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-6 bg-white/90 backdrop-blur-sm border border-gray-200 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    icon={<Search size={20} />}
                  />
                </div>

                <div className="flex gap-3">
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>

                  <select
                    className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'date' | 'amount' | 'client')}
                  >
                    <option value="date">Sort by Date</option>
                    <option value="amount">Sort by Amount</option>
                    <option value="client">Sort by Client</option>
                  </select>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Invoices Table */}
          <motion.div variants={itemVariants}>
            <GlassCard className="overflow-hidden bg-white/90 backdrop-blur-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/5">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-black">Invoice</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-black">Client</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-black">Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-black">Amount</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-black">Due Date</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInvoices.map((invoice, index) => {
                const overdue = isOverdue(invoice.dueDate, invoice.status);

                return (
                  <motion.tr
                    key={invoice.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-black">{invoice.invoiceNumber}</p>
                        <p className="text-sm text-gray-500">{formatDate(invoice.issueDate)}</p>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-black">{invoice.clientName}</p>
                        <p className="text-sm text-gray-500">{invoice.clientEmail}</p>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(overdue ? 'overdue' : invoice.status)}
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          overdue ? INVOICE_STATUS_COLORS.overdue : INVOICE_STATUS_COLORS[invoice.status]
                        }`}>
                          {overdue ? 'Overdue' : invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <p className="font-medium text-black">{formatCurrency(invoice.total)}</p>
                    </td>

                    <td className="py-4 px-6">
                      <p className={`text-sm ${overdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                        {formatDate(invoice.dueDate)}
                      </p>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewInvoice(invoice.customSlug!)}
                          className="p-2"
                          title="View Invoice"
                        >
                          <Eye size={16} />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyUrl(invoice.customSlug!)}
                          className="p-2"
                          title="Copy URL"
                        >
                          <Copy size={16} />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2"
                          title="More Options"
                        >
                          <MoreVertical size={16} />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-black mb-2">No invoices found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Create your first invoice to get started.'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <InteractiveHoverButton
                text="Create First Invoice"
                onClick={() => navigate('/invoice/create')}
                className="w-48 h-12 text-black border-black"
              />
            )}
          </div>
        )}
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default InvoicesPage;
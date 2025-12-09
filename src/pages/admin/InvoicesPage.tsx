import React, { useState, useEffect } from 'react';
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
import { invoiceService } from '../../services/invoiceService';

const InvoicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'client'>('date');
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch real invoices from Supabase
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await invoiceService.getInvoices();

        // Transform Supabase data to match InvoiceData interface
        const transformedInvoices: InvoiceData[] = data.map((inv: any) => ({
          id: inv.id,
          invoiceNumber: inv.invoice_number,
          customSlug: inv.custom_slug,
          clientName: inv.client_name,
          clientEmail: inv.client_email,
          clientAddress: inv.client_address || undefined,
          clientPhone: inv.client_phone || undefined,
          issueDate: inv.issue_date ? inv.issue_date.split('T')[0] : inv.created_at.split('T')[0],
          dueDate: inv.due_date || '',
          status: inv.status === 'paid' ? 'paid' : inv.status === 'pending' ? 'sent' : 'draft',
          items: inv.items || [],
          subtotal: inv.subtotal || 0,
          taxRate: inv.tax_rate || 0,
          taxAmount: inv.tax_amount || 0,
          total: inv.total || 0,
          notes: inv.notes || '',
          paymentTerms: inv.payment_terms || 'Payment due within 30 days',
          paymentLink: inv.payment_link || undefined,
          createdAt: inv.created_at,
          updatedAt: inv.updated_at || inv.created_at,
          createdBy: inv.user_id
        }));

        setInvoices(transformedInvoices);
      } catch (err) {
        console.error('Error fetching invoices:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch invoices');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

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

  // Loading state
  if (loading) {
    return (
      <div className="relative">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Squares
            direction="diagonal"
            speed={0.3}
            borderColor="rgba(0, 0, 0, 0.025)"
            squareSize={40}
            hoverFillColor="rgba(0, 0, 0, 0.015)"
          />
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-[400px]">
          <GlassCard className="p-8 text-center bg-white/90 backdrop-blur-sm border border-gray-200">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading invoices...</p>
          </GlassCard>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="relative">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Squares
            direction="diagonal"
            speed={0.3}
            borderColor="rgba(0, 0, 0, 0.025)"
            squareSize={40}
            hoverFillColor="rgba(0, 0, 0, 0.015)"
          />
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-[400px]">
          <GlassCard className="p-8 text-center max-w-md bg-white/90 backdrop-blur-sm border border-gray-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to Load Invoices</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <InteractiveHoverButton
              text="Try Again"
              onClick={() => window.location.reload()}
              className="w-32 h-10 text-black border-black"
            />
          </GlassCard>
        </div>
      </div>
    );
  }

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
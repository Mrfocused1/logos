import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Download,
  Share2,
  Copy,
  Check,
  Calendar,
  Phone,
  MapPin,
  CreditCard
} from 'lucide-react';
import { Button, GlassCard, Toast, InteractiveHoverButton, Squares } from '../components/ui';
import type { InvoiceData } from '../types/invoice';
import { formatCurrency, formatDate, isOverdue } from '../utils/invoice';
import { INVOICE_STATUS_COLORS } from '../types/invoice';

const InvoiceViewPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Load invoice data from localStorage (in real app, fetch from API/database)
  useEffect(() => {
    const loadInvoice = async () => {
      setLoading(true);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      try {
        // Try to load real invoice data from localStorage
        const storedInvoice = localStorage.getItem(`invoice-${slug}`);

        if (storedInvoice) {
          const invoiceData: InvoiceData = JSON.parse(storedInvoice);
          setInvoice(invoiceData);
        } else {
          // Fallback to mock data if no real invoice found
          const mockInvoice: InvoiceData = {
            id: 'invoice-123',
            invoiceNumber: 'BL-202501-001',
            customSlug: slug || 'sample-invoice',
            clientName: 'Sample Client Ltd.',
            clientEmail: 'client@example.com',
            clientAddress: '123 Business Street\nLondon, SW1A 1AA\nUnited Kingdom',
            clientPhone: '+44 20 7946 0958',
            issueDate: '2025-01-15',
            dueDate: '2025-02-14',
            status: 'sent',
            items: [
              {
                id: 'item-1',
                description: 'Logo Design & Brand Identity Package',
                quantity: 1,
                unitPrice: 750.00,
                total: 750.00
              },
              {
                id: 'item-2',
                description: 'Business Card Design',
                quantity: 1,
                unitPrice: 150.00,
                total: 150.00
              }
            ],
            subtotal: 900.00,
            taxRate: 20,
            taxAmount: 180.00,
            total: 1080.00,
            notes: 'Thank you for choosing BOLA LOGOS for your design needs.',
            paymentTerms: 'Payment due within 30 days',
            createdAt: '2025-01-15T10:00:00Z',
            updatedAt: '2025-01-15T10:00:00Z',
            createdBy: 'admin'
          };
          setInvoice(mockInvoice);
        }
      } catch (error) {
        console.error('Error loading invoice:', error);
        setInvoice(null);
      }

      setLoading(false);
    };

    if (slug) {
      loadInvoice();
    }
  }, [slug]);

  const copyInvoiceUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopySuccess(true);
    showToast('Invoice URL copied to clipboard!');
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleDownload = () => {
    showToast('PDF download feature coming soon!');
  };

  const handlePayment = () => {
    if (invoice?.paymentLink) {
      // Open the payment link provided by the admin
      window.open(invoice.paymentLink, '_blank');
    } else {
      showToast('No payment link available for this invoice.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden flex items-center justify-center">
        {/* Animated Grid Background */}
        <div className="fixed inset-0 z-0">
          <Squares
            direction="diagonal"
            speed={0.3}
            borderColor="rgba(0, 0, 0, 0.015)"
            squareSize={25}
            hoverFillColor="rgba(0, 0, 0, 0.008)"
          />
        </div>
        <GlassCard className="p-8 text-center relative z-10 bg-white/90 backdrop-blur-sm border border-gray-200">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoice...</p>
        </GlassCard>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden flex items-center justify-center px-4">
        {/* Animated Grid Background */}
        <div className="fixed inset-0 z-0">
          <Squares
            direction="diagonal"
            speed={0.3}
            borderColor="rgba(0, 0, 0, 0.015)"
            squareSize={25}
            hoverFillColor="rgba(0, 0, 0, 0.008)"
          />
        </div>
        <GlassCard className="p-8 text-center max-w-md mx-auto relative z-10 bg-white/90 backdrop-blur-sm border border-gray-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invoice Not Found</h1>
          <p className="text-gray-600 mb-6">
            The invoice you're looking for doesn't exist or may have been removed.
          </p>
          <Button
            variant="primary"
            onClick={() => navigate('/')}
            className="gap-2 bg-black text-white hover:bg-white hover:text-black border border-black transition-all duration-300"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Button>
        </GlassCard>
      </div>
    );
  }

  const statusColor = INVOICE_STATUS_COLORS[invoice.status];
  const overdue = isOverdue(invoice.dueDate, invoice.status);

  return (
    <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden px-4 py-8">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 z-0">
        <Squares
          direction="diagonal"
          speed={0.3}
          borderColor="rgba(0, 0, 0, 0.015)"
          squareSize={25}
          hoverFillColor="rgba(0, 0, 0, 0.008)"
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Actions */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="gap-2 text-black hover:bg-black hover:text-white border border-black transition-all duration-300"
            aria-label="Go back to home"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Button>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={copyInvoiceUrl}
              className="gap-2"
            >
              {copySuccess ? <Check size={16} /> : <Copy size={16} />}
              {copySuccess ? 'Copied!' : 'Share'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownload}
              className="gap-2"
            >
              <Download size={16} />
              Download PDF
            </Button>
          </div>
        </motion.div>

        {/* Invoice Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <GlassCard className="p-8 md:p-12 bg-white/90 backdrop-blur-sm border border-gray-200">
            {/* Invoice Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start mb-12">
              <div className="mb-6 lg:mb-0">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">INVOICE</h1>
                <div className="mt-3">
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </span>
                  {overdue && (
                    <span className="ml-2 inline-flex px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      Overdue
                    </span>
                  )}
                </div>
              </div>

              <div className="text-left lg:text-right">
                <h2 className="text-2xl font-bold text-black mb-1">BOLA LOGOS</h2>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="flex items-center gap-2 lg:justify-end">
                    <Calendar size={16} />
                    <span className="font-medium">Issue Date:</span> {formatDate(invoice.issueDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Client Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Bill To:</h3>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900 text-lg">{invoice.clientName}</p>

                  <div className="text-gray-600">
                    <a
                      href={`mailto:${invoice.clientEmail}`}
                      className="hover:text-black transition-colors"
                    >
                      {invoice.clientEmail}
                    </a>
                  </div>

                  {invoice.clientPhone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone size={16} />
                      <a
                        href={`tel:${invoice.clientPhone}`}
                        className="hover:text-primary transition-colors"
                      >
                        {invoice.clientPhone}
                      </a>
                    </div>
                  )}

                  {invoice.clientAddress && (
                    <div className="flex items-start gap-2 text-gray-600">
                      <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                      <p className="whitespace-pre-line">{invoice.clientAddress}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:text-right">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">From:</h3>
                <div className="space-y-2 text-gray-600">
                  <p className="font-medium text-gray-900">BOLA LOGOS</p>
                  <p>logosbola@gmail.com</p>
                  <p>London, United Kingdom</p>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-12">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-4 text-sm font-semibold text-gray-900 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="text-right py-4 text-sm font-semibold text-gray-900 uppercase tracking-wider">
                        Qty
                      </th>
                      <th className="text-right py-4 text-sm font-semibold text-gray-900 uppercase tracking-wider">
                        Rate
                      </th>
                      <th className="text-right py-4 text-sm font-semibold text-gray-900 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {invoice.items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 text-gray-900">
                          <div className="font-medium">{item.description}</div>
                        </td>
                        <td className="py-4 text-gray-600 text-right">{item.quantity}</td>
                        <td className="py-4 text-gray-600 text-right">{formatCurrency(item.unitPrice)}</td>
                        <td className="py-4 text-gray-900 text-right font-medium">{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-12">
              <div className="w-full sm:w-80">
                <div className="space-y-3">
                  <div className="border-t-2 border-gray-200 pt-3">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total:</span>
                      <span className="text-black">{formatCurrency(invoice.subtotal)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            {invoice.status !== 'paid' && (
              <div className="mb-12">
                <GlassCard variant="subtle" className="p-6 bg-white/90 backdrop-blur-sm border border-gray-200">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Ready to Pay?
                      </h3>
                      <p className="text-gray-600">
                        {invoice.paymentLink
                          ? 'Click the button below to proceed with secure payment.'
                          : 'Contact us to arrange payment for this invoice.'
                        }
                      </p>
                    </div>
                    <InteractiveHoverButton
                      text={invoice.paymentLink ? `Pay ${formatCurrency(invoice.subtotal)}` : 'No Payment Link'}
                      onClick={handlePayment}
                      className="w-40 h-12 text-black border-black"
                      disabled={!invoice.paymentLink}
                    />
                  </div>
                </GlassCard>
              </div>
            )}

            {/* Additional Information */}
            {invoice.notes && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes:</h3>
                <p className="text-gray-600 whitespace-pre-line leading-relaxed">{invoice.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
              <p>Thank you for choosing BOLA LOGOS for your design needs.</p>
              <p className="mt-1">For any questions, please contact us at logosbola@gmail.com</p>
            </div>
          </GlassCard>
        </motion.div>

        {/* Toast */}
        {toastMessage && (
          <Toast
            message={toastMessage}
            type="success"
            onClose={() => setToastMessage('')}
          />
        )}
      </div>
    </div>
  );
};

export default InvoiceViewPage;
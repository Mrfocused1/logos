import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Plus, Trash2, Copy, Check, AlertCircle } from 'lucide-react';
import { Button, GlassCard, Input, Toast, Squares } from '../components/ui';
import type { InvoiceFormData } from '../types/invoice';
import { DEFAULT_PAYMENT_TERMS } from '../types/invoice';
import {
  createInvoiceFromForm,
  generateInvoiceUrl,
  validateEmail,
  calculateDueDate,
  calculateItemTotal,
  formatCurrency
} from '../utils/invoice';
import { invoiceService } from '../services/invoiceService';
import { useAuth } from '../context/AuthContext';

const InvoiceCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const clientInfoRef = useRef<HTMLDivElement>(null);
  const invoiceDetailsRef = useRef<HTMLDivElement>(null);
  const invoiceItemsRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<InvoiceFormData>({
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    clientPhone: '',
    paymentLink: '',
    dueDate: new Date().toISOString().split('T')[0],
    items: [{ description: '', quantity: 1, unitPrice: 0 }],
    taxRate: 0,
    notes: '',
    paymentTerms: DEFAULT_PAYMENT_TERMS[0]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generatedInvoice, setGeneratedInvoice] = useState<any>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showErrorSummary, setShowErrorSummary] = useState(false);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const getErrorSummary = (errors: Record<string, string>): string[] => {
    const errorMessages: string[] = [];

    if (errors.clientName) errorMessages.push('Client name is required');
    if (errors.dueDate) errorMessages.push('Due date is required');

    // Check for item errors
    const itemErrors = Object.keys(errors).filter(key => key.startsWith('item-'));
    if (itemErrors.length > 0) {
      const itemNumbers = new Set(itemErrors.map(key => {
        const match = key.match(/item-(\d+)-/);
        return match ? parseInt(match[1]) + 1 : 0;
      }));
      itemNumbers.forEach(num => {
        if (num > 0) errorMessages.push(`Item ${num} has missing or invalid fields`);
      });
    }

    if (errors.items) errorMessages.push('At least one item is required');

    return errorMessages;
  };

  const scrollToFirstError = (errors: Record<string, string>) => {
    const errorKeys = Object.keys(errors);
    if (errorKeys.length === 0) return;

    // Determine which section has the first error
    if (errors.clientName) {
      clientInfoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (errors.dueDate) {
      invoiceDetailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (errorKeys.some(key => key.startsWith('item-') || key === 'items')) {
      invoiceItemsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const validateForm = (): { isValid: boolean; errors: Record<string, string> } => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }


    // Items validation
    formData.items.forEach((item, index) => {
      if (!item.description.trim()) {
        newErrors[`item-${index}-description`] = 'Description is required';
      }
      if (item.quantity <= 0) {
        newErrors[`item-${index}-quantity`] = 'Quantity must be greater than 0';
      }
      if (item.unitPrice <= 0) {
        newErrors[`item-${index}-unitPrice`] = 'Unit price must be greater than 0';
      }
    });

    // At least one item required
    if (formData.items.length === 0) {
      newErrors.items = 'At least one item is required';
    }

    setErrors(newErrors);
    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors
    };
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitPrice: 0 }]
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const calculateTotals = () => {
    const items = formData.items.map(item => ({
      ...item,
      total: calculateItemTotal(item.quantity, item.unitPrice)
    }));

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = Math.round((subtotal * (formData.taxRate / 100)) * 100) / 100;
    const total = Math.round((subtotal + taxAmount) * 100) / 100;

    return { subtotal, taxAmount, total };
  };


  const handleCreateInvoice = async () => {
    const validation = validateForm();
    if (!validation.isValid) {
      setShowErrorSummary(true);
      scrollToFirstError(validation.errors);
      const errorSummary = getErrorSummary(validation.errors);
      showToast(`Please fix ${errorSummary.length} error${errorSummary.length > 1 ? 's' : ''} before creating the invoice`);
      return;
    }

    setShowErrorSummary(false);

    try {
      const invoice = createInvoiceFromForm(formData, isAuthenticated ? 'admin' : 'public');
      const slug = invoice.customSlug!;
      const invoiceUrl = generateInvoiceUrl(slug);

      if (isAuthenticated) {
        // Save invoice to Supabase database for admin users
        await invoiceService.createInvoice(invoice);
        console.log('Invoice saved to Supabase:', invoice);
      } else {
        // Save invoice to localStorage for public users (fallback)
        localStorage.setItem(`invoice-${slug}`, JSON.stringify(invoice));
        console.log('Invoice saved to localStorage:', invoice);
      }

      console.log('Generated URL:', invoiceUrl);
      showToast(`Invoice created! URL: www.bolalogos.com/invoice/${slug}`);
      setGeneratedInvoice(invoice);

      // Navigate to invoice view
      navigate(`/invoice/${slug}`);
    } catch (error) {
      console.error('Error creating invoice:', error);
      showToast('Failed to create invoice. Please try again.');
    }
  };

  const copyInvoiceUrl = () => {
    if (generatedInvoice) {
      const url = generateInvoiceUrl(generatedInvoice.customSlug);
      navigator.clipboard.writeText(url);
      setCopySuccess(true);
      showToast('Invoice URL copied to clipboard!');
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const { subtotal, total } = calculateTotals();

  return (
    <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden px-4 py-12">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 z-0">
        <Squares
          direction="diagonal"
          speed={0.3}
          borderColor="rgba(0, 0, 0, 0.025)"
          squareSize={40}
          hoverFillColor="rgba(0, 0, 0, 0.015)"
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
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
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-black/10 rounded-xl">
              <FileText className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-heading text-black">
                Create Invoice
              </h1>
              <p className="text-gray-600 font-medium">
                Generate a professional invoice for your client
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Client Information */}
            <div ref={clientInfoRef}>
              <GlassCard className="p-6 bg-white/90 backdrop-blur-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-black mb-4">Client Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Client Name"
                  placeholder="Enter client name"
                  value={formData.clientName}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                  error={errors.clientName}
                  required
                />
                <Input
                  label="Payment Link"
                  placeholder="https://buy.stripe.com/... or https://paypal.me/username/amount"
                  value={formData.paymentLink}
                  onChange={(e) => setFormData(prev => ({ ...prev, paymentLink: e.target.value }))}
                  error={errors.paymentLink}
                  helperText="Optional: Full payment URL (e.g., Stripe checkout, PayPal, bank transfer page)"
                />
              </div>

              {/* Dynamic URL Preview */}
              {formData.clientName && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-sm font-medium text-blue-800 mb-1">
                    Generated Invoice URL:
                  </p>
                  <p className="text-sm text-blue-600 font-mono">
                    www.bolalogos.com/{formData.clientName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') || 'client'}
                  </p>
                  <p className="text-xs text-blue-500 mt-1">
                    This URL will be automatically generated from the client name
                  </p>
                </div>
              )}
              </GlassCard>
            </div>

            {/* Invoice Details */}
            <div ref={invoiceDetailsRef}>
              <GlassCard className="p-6 bg-white/90 backdrop-blur-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-black mb-4">Invoice Details</h2>
              <div className="grid grid-cols-1 gap-4">
                <Input
                  label="Date"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  error={errors.dueDate}
                  required
                />
              </div>
              </GlassCard>
            </div>

            {/* Invoice Items */}
            <div ref={invoiceItemsRef}>
              <GlassCard className="p-6 bg-white/90 backdrop-blur-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-black">Invoice Items</h2>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={addItem}
                  className="gap-2 bg-black text-white hover:bg-white hover:text-black border border-black transition-all duration-300"
                >
                  <Plus size={16} />
                  Add Item
                </Button>
              </div>

              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 items-start p-4 bg-white/50 rounded-xl">
                    <div className="col-span-12 sm:col-span-5">
                      <Input
                        label="Description"
                        placeholder="Item description"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        error={errors[`item-${index}-description`]}
                        size="sm"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-2">
                      <Input
                        label="Qty"
                        type="number"
                        min="1"
                        value={String(item.quantity)}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        error={errors[`item-${index}-quantity`]}
                        size="sm"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <Input
                        label="Unit Price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={String(item.unitPrice)}
                        onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        error={errors[`item-${index}-unitPrice`]}
                        size="sm"
                      />
                    </div>
                    <div className="col-span-10 sm:col-span-1 flex items-end">
                      <div className="text-sm font-medium text-gray-900 mb-3">
                        {formatCurrency(calculateItemTotal(item.quantity, item.unitPrice))}
                      </div>
                    </div>
                    <div className="col-span-2 sm:col-span-1 flex items-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                        disabled={formData.items.length === 1}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 transition-all duration-300"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              </GlassCard>
            </div>

            {/* Additional Information */}
            <GlassCard className="p-6 bg-white/90 backdrop-blur-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-black mb-4">Additional Information</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Add any additional notes or terms..."
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
            </GlassCard>
          </motion.div>

          {/* Sidebar - Invoice Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Invoice Summary */}
            <GlassCard className="p-6 sticky top-6 bg-white/90 backdrop-blur-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-black mb-4">Invoice Summary</h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-900">{formatCurrency(subtotal)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-black">Total:</span>
                    <span className="font-bold text-xl text-black">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              {/* Error Summary */}
              {showErrorSummary && Object.keys(errors).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl"
                >
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-red-800 mb-2">
                        Please fix the following errors:
                      </p>
                      <ul className="text-xs text-red-700 space-y-1">
                        {getErrorSummary(errors).map((error, index) => (
                          <li key={index} className="flex items-start gap-1">
                            <span className="text-red-500 mt-0.5">•</span>
                            <span>{error}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="mt-6">
                <Button
                  variant="primary"
                  className="w-full gap-2 bg-black text-white hover:bg-white hover:text-black border border-black transition-all duration-300"
                  onClick={handleCreateInvoice}
                >
                  Create Invoice
                </Button>
              </div>

              {generatedInvoice && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        Invoice Created!
                      </p>
                      <p className="text-xs text-green-600">
                        {generatedInvoice.invoiceNumber}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyInvoiceUrl}
                      className="gap-2 text-black hover:bg-black hover:text-white transition-all duration-300"
                    >
                      {copySuccess ? <Check size={16} /> : <Copy size={16} />}
                      {copySuccess ? 'Copied!' : 'Copy URL'}
                    </Button>
                  </div>
                </div>
              )}
            </GlassCard>
          </motion.div>
        </div>


        {/* Toast */}
        {toastMessage && (
          <Toast
            id="create-invoice-toast"
            message={toastMessage}
            type="success"
            onClose={() => setToastMessage('')}
          />
        )}
      </div>
    </div>
  );
};

export default InvoiceCreatePage;
import type { InvoiceData, InvoiceFormData, InvoiceItem } from '../types/invoice';

// Generate unique invoice number
export const generateInvoiceNumber = (): string => {
  const prefix = 'BL';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
};

// Generate URL-friendly slug from client name only
export const generateSlug = (clientName: string): string => {
  const cleanName = clientName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '') // Remove leading/trailing dashes
    .trim();

  // If the cleaned name is empty or too short, generate a fallback
  if (!cleanName || cleanName.length < 2) {
    return `client-${Date.now().toString().slice(-6)}`;
  }

  return cleanName;
};

// Validate custom slug
export const validateSlug = (slug: string): boolean => {
  const slugRegex = /^[a-z0-9-]+$/;
  return slugRegex.test(slug) && slug.length >= 3 && slug.length <= 50;
};

// Calculate item total
export const calculateItemTotal = (quantity: number, unitPrice: number): number => {
  return Math.round((quantity * unitPrice) * 100) / 100;
};

// Calculate invoice totals
export const calculateInvoiceTotals = (items: InvoiceItem[], taxRate: number) => {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = Math.round((subtotal * (taxRate / 100)) * 100) / 100;
  const total = Math.round((subtotal + taxAmount) * 100) / 100;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    taxAmount,
    total
  };
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
  }).format(amount);
};

// Format date for display
export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(dateString));
};

// Get due date based on days
export const calculateDueDate = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

// Convert form data to invoice data
export const createInvoiceFromForm = (
  formData: InvoiceFormData,
  userId: string
): InvoiceData => {
  const invoiceNumber = generateInvoiceNumber();
  const slug = generateSlug(formData.clientName);

  // Process items with IDs and totals
  const items: InvoiceItem[] = formData.items.map((item, index) => ({
    id: `item-${index + 1}`,
    ...item,
    total: calculateItemTotal(item.quantity, item.unitPrice)
  }));

  const { subtotal, taxAmount, total } = calculateInvoiceTotals(items, formData.taxRate);

  const now = new Date().toISOString();

  return {
    id: `invoice-${Date.now()}`,
    invoiceNumber,
    customSlug: slug,
    clientName: formData.clientName,
    clientEmail: formData.clientEmail,
    clientAddress: formData.clientAddress,
    clientPhone: formData.clientPhone,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: formData.dueDate,
    status: 'draft',
    items,
    subtotal,
    taxRate: formData.taxRate,
    taxAmount,
    total,
    notes: formData.notes,
    paymentTerms: formData.paymentTerms,
    paymentLink: formData.paymentLink,
    createdAt: now,
    updatedAt: now,
    createdBy: userId
  };
};

// Generate invoice URL
export const generateInvoiceUrl = (slug: string, baseUrl: string = window.location.origin): string => {
  return `${baseUrl}/invoice/${slug}`;
};

// Validate email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Check if invoice is overdue
export const isOverdue = (dueDate: string, status: string): boolean => {
  if (status === 'paid') return false;
  return new Date(dueDate) < new Date();
};
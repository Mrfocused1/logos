export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  customSlug?: string;

  // Client Information
  clientName: string;
  clientEmail: string;
  clientAddress?: string;
  clientPhone?: string;

  // Invoice Details
  issueDate: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';

  // Items
  items: InvoiceItem[];

  // Totals
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;

  // Additional Information
  notes?: string;
  paymentTerms?: string;
  paymentLink?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface InvoiceFormData {
  clientName: string;
  clientEmail: string;
  clientAddress?: string;
  clientPhone?: string;
  paymentLink?: string;
  dueDate: string;
  items: Omit<InvoiceItem, 'id' | 'total'>[];
  taxRate: number;
  notes?: string;
  paymentTerms?: string;
}

export const DEFAULT_PAYMENT_TERMS = [
  'Payment due within 30 days',
  'Payment due within 14 days',
  'Payment due within 7 days',
  'Payment due upon receipt',
  'Net 30',
  'Net 15',
  'Custom terms'
];

export const INVOICE_STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800'
} as const;
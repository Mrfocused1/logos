import { supabase } from '../lib/supabase'
import type { InvoiceData } from '../types/invoice'

export const invoiceService = {
  // Create a new invoice
  async createInvoice(invoice: Omit<InvoiceData, 'id' | 'createdAt'>) {
    const { data: user } = await supabase.auth.getUser()

    if (!user.user) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .from('invoices')
      .insert({
        user_id: user.user.id,
        invoice_number: invoice.invoiceNumber,
        custom_slug: invoice.customSlug,
        client_name: invoice.clientName,
        client_email: invoice.clientEmail,
        client_address: invoice.clientAddress || null,
        items: invoice.items,
        subtotal: invoice.subtotal,
        total: invoice.total,
        payment_link: invoice.paymentLink || null,
        status: 'unpaid',
        due_date: invoice.dueDate || null
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create invoice: ${error.message}`)
    }

    return data
  },

  // Get invoice by custom slug
  async getInvoiceBySlug(slug: string) {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('custom_slug', slug)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Invoice not found
      }
      throw new Error(`Failed to fetch invoice: ${error.message}`)
    }

    return data
  },

  // Get all invoices for current user
  async getInvoices() {
    const { data: user } = await supabase.auth.getUser()

    if (!user.user) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch invoices: ${error.message}`)
    }

    return data
  },

  // Get dashboard statistics
  async getDashboardStats() {
    const { data: user } = await supabase.auth.getUser()

    if (!user.user) {
      throw new Error('User not authenticated')
    }

    const { data: invoices, error } = await supabase
      .from('invoices')
      .select('total, status, created_at')
      .eq('user_id', user.user.id)

    if (error) {
      throw new Error(`Failed to fetch dashboard stats: ${error.message}`)
    }

    const totalInvoices = invoices.length
    const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.total, 0)

    // Calculate this month's revenue
    const now = new Date()
    const thisMonth = invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.created_at)
      return invoiceDate.getMonth() === now.getMonth() &&
             invoiceDate.getFullYear() === now.getFullYear()
    })
    const thisMonthRevenue = thisMonth.reduce((sum, invoice) => sum + invoice.total, 0)

    return {
      totalInvoices,
      totalRevenue,
      thisMonthRevenue,
      paidInvoices: invoices.filter(inv => inv.status === 'paid').length
    }
  },

  // Update invoice status
  async updateInvoiceStatus(id: string, status: 'paid' | 'unpaid' | 'pending') {
    const { data, error } = await supabase
      .from('invoices')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update invoice status: ${error.message}`)
    }

    return data
  },

  // Delete invoice
  async deleteInvoice(id: string) {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete invoice: ${error.message}`)
    }
  }
}
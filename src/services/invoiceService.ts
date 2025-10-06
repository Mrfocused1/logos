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
        // client_phone: invoice.clientPhone || null, // Temporarily disabled - column missing in DB
        // issue_date: invoice.issueDate, // Temporarily disabled - column missing in DB
        due_date: invoice.dueDate || null,
        items: invoice.items,
        subtotal: invoice.subtotal,
        // tax_rate: invoice.taxRate || 0, // Temporarily disabled - column missing in DB
        // tax_amount: invoice.taxAmount || 0, // Temporarily disabled - column missing in DB
        total: invoice.total,
        // notes: invoice.notes || null, // Temporarily disabled - column missing in DB
        // payment_terms: invoice.paymentTerms || null, // Temporarily disabled - column missing in DB
        payment_link: invoice.paymentLink || null,
        status: invoice.status === 'paid' ? 'paid' : 'unpaid'
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create invoice: ${error.message}`)
    }

    return data
  },

  // Get invoice by custom slug (supports both authenticated and public access)
  async getInvoiceBySlug(slug: string) {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('custom_slug', slug)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // Invoice not found
        }
        // For other errors (like RLS), log and return null to allow localStorage fallback
        console.warn('Supabase query failed, trying localStorage fallback:', error.message)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in getInvoiceBySlug:', error)
      return null // Return null for any errors to allow fallback to localStorage
    }
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
  },

  // Migration utility: Move localStorage invoices to Supabase
  async migrateLocalStorageInvoices() {
    const { data: user } = await supabase.auth.getUser()

    if (!user.user) {
      throw new Error('User not authenticated')
    }

    const migrationResults = {
      found: 0,
      migrated: 0,
      skipped: 0,
      errors: [] as string[]
    }

    try {
      // Scan localStorage for invoice keys
      const invoiceKeys = Object.keys(localStorage).filter(key => key.startsWith('invoice-'))
      migrationResults.found = invoiceKeys.length

      if (invoiceKeys.length === 0) {
        return migrationResults
      }

      for (const key of invoiceKeys) {
        try {
          const invoiceData = localStorage.getItem(key)
          if (!invoiceData) continue

          const invoice = JSON.parse(invoiceData)

          // Check if this invoice already exists in Supabase
          const existingInvoice = await this.getInvoiceBySlug(invoice.customSlug)
          if (existingInvoice) {
            migrationResults.skipped++
            continue
          }

          // Transform localStorage invoice to Supabase format
          const { error } = await supabase
            .from('invoices')
            .insert({
              user_id: user.user.id,
              invoice_number: invoice.invoiceNumber,
              custom_slug: invoice.customSlug,
              client_name: invoice.clientName,
              client_email: invoice.clientEmail,
              client_address: invoice.clientAddress || null,
              // client_phone: invoice.clientPhone || null, // Temporarily disabled - column missing in DB
              items: invoice.items || [],
              subtotal: invoice.subtotal || 0,
              total: invoice.total || 0,
              payment_link: invoice.paymentLink || null,
              status: invoice.status === 'paid' ? 'paid' : invoice.status === 'sent' ? 'pending' : 'unpaid',
              due_date: invoice.dueDate || null
            })
            .select()
            .single()

          if (error) {
            migrationResults.errors.push(`Failed to migrate ${invoice.customSlug}: ${error.message}`)
          } else {
            migrationResults.migrated++
            // Optionally remove from localStorage after successful migration
            // localStorage.removeItem(key)
          }
        } catch (error) {
          migrationResults.errors.push(`Failed to parse invoice ${key}: ${error}`)
        }
      }

      return migrationResults
    } catch (error) {
      throw new Error(`Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}
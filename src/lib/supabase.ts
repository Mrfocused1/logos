import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug logging for development
if (import.meta.env.DEV) {
  console.log('Supabase URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
  console.log('Supabase Key:', supabaseAnonKey ? '✅ Set' : '❌ Missing')
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Environment variables:', {
    VITE_SUPABASE_URL: supabaseUrl,
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? 'SET' : 'MISSING'
  })
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface Database {
  public: {
    Tables: {
      invoices: {
        Row: {
          id: string
          created_at: string
          user_id: string
          invoice_number: string
          custom_slug: string
          client_name: string
          client_email: string
          client_address: string | null
          items: InvoiceItem[]
          subtotal: number
          total: number
          payment_link: string | null
          status: 'paid' | 'unpaid' | 'pending'
          due_date: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          invoice_number: string
          custom_slug: string
          client_name: string
          client_email: string
          client_address?: string | null
          items: InvoiceItem[]
          subtotal: number
          total: number
          payment_link?: string | null
          status?: 'paid' | 'unpaid' | 'pending'
          due_date?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          invoice_number?: string
          custom_slug?: string
          client_name?: string
          client_email?: string
          client_address?: string | null
          items?: InvoiceItem[]
          subtotal?: number
          total?: number
          payment_link?: string | null
          status?: 'paid' | 'unpaid' | 'pending'
          due_date?: string | null
        }
      }
    }
  }
}

export interface InvoiceItem {
  description: string
  quantity: number
  price: number
  total: number
}
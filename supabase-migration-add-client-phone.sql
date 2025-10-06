-- Add missing client_phone column to invoices table
ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS client_phone TEXT;

-- Also verify other potentially missing columns exist
-- (Run these one at a time if needed)

-- Add payment_terms if missing
ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS payment_terms TEXT;

-- Add tax_rate if missing
ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS tax_rate NUMERIC DEFAULT 0;

-- Add tax_amount if missing
ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS tax_amount NUMERIC DEFAULT 0;

-- Add notes if missing
ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add issue_date if missing
ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS issue_date TEXT;

-- Verify the schema
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'invoices'
ORDER BY ordinal_position;

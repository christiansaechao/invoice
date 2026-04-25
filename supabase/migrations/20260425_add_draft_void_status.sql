-- Migration: Add 'draft' and 'void' to invoice_status enum
-- Run this against your Supabase database (SQL Editor or migration tool)

-- Note: ALTER TYPE ... ADD VALUE cannot be run inside a transaction in Postgres.
-- Run each statement separately if your tool wraps them in a transaction.

ALTER TYPE invoice_status ADD VALUE IF NOT EXISTS 'draft' BEFORE 'pending';
ALTER TYPE invoice_status ADD VALUE IF NOT EXISTS 'void' AFTER 'paid';

-- Migration: Add invoice_tax_lines table for multi-tax region support
-- and a helper view for invoice balance tracking
-- Run this against your Supabase database (SQL Editor)

-- ─── Multi-tax lines table ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS invoice_tax_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  label TEXT NOT NULL DEFAULT 'Tax',          -- e.g. "State Tax", "County Tax", "VAT"
  rate_bps INTEGER NOT NULL DEFAULT 0,        -- basis points (825 = 8.25%)
  amount_cents INTEGER NOT NULL DEFAULT 0,    -- computed tax amount in cents
  sort_order INTEGER NOT NULL DEFAULT 0,      -- display order
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookups by invoice
CREATE INDEX IF NOT EXISTS idx_tax_lines_invoice_id ON invoice_tax_lines(invoice_id);

-- Constraint: rate and amount must be non-negative
ALTER TABLE invoice_tax_lines ADD CONSTRAINT chk_tax_line_rate_non_negative
  CHECK (rate_bps >= 0);
ALTER TABLE invoice_tax_lines ADD CONSTRAINT chk_tax_line_amount_non_negative
  CHECK (amount_cents >= 0);

-- Enable RLS
ALTER TABLE invoice_tax_lines ENABLE ROW LEVEL SECURITY;

-- Policy: users can only see their own invoice tax lines
CREATE POLICY "Users can manage their own invoice tax lines"
  ON invoice_tax_lines
  FOR ALL
  USING (
    invoice_id IN (
      SELECT id FROM invoices WHERE user_id = auth.uid()
    )
  );


-- ─── Invoice balance tracking (computed from payments) ───────────────────────

-- This function computes the balance due for a given invoice.
-- balance_due = total_amount - SUM(completed payments)
-- Negative payment amounts represent refunds.
CREATE OR REPLACE FUNCTION get_invoice_balance(p_invoice_id UUID)
RETURNS TABLE (
  total_amount_cents BIGINT,
  total_paid_cents BIGINT,
  total_refunded_cents BIGINT,
  balance_due_cents BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    inv.total_amount::BIGINT AS total_amount_cents,
    COALESCE(SUM(CASE WHEN ip.amount > 0 AND ip.status = 'completed' THEN ip.amount ELSE 0 END), 0)::BIGINT AS total_paid_cents,
    COALESCE(SUM(CASE WHEN ip.amount < 0 AND ip.status = 'completed' THEN ABS(ip.amount) ELSE 0 END), 0)::BIGINT AS total_refunded_cents,
    (inv.total_amount - COALESCE(SUM(CASE WHEN ip.status = 'completed' THEN ip.amount ELSE 0 END), 0))::BIGINT AS balance_due_cents
  FROM invoices inv
  LEFT JOIN invoice_payments ip ON ip.invoice_id = inv.id
  WHERE inv.id = p_invoice_id
  GROUP BY inv.id, inv.total_amount;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

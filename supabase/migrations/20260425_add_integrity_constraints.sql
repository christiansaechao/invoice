-- Migration: Add data integrity constraints to invoices table
-- Run this against your Supabase database (SQL Editor)

-- ─── CHECK constraints: sanity bounds ─────────────────────────────────────────

-- Prevent obviously wrong monetary values
ALTER TABLE invoices ADD CONSTRAINT chk_subtotal_non_negative
  CHECK (subtotal >= 0);

ALTER TABLE invoices ADD CONSTRAINT chk_total_non_negative
  CHECK (total_amount >= 0);

ALTER TABLE invoices ADD CONSTRAINT chk_tax_non_negative
  CHECK (COALESCE(tax_amount, 0) >= 0);

ALTER TABLE invoices ADD CONSTRAINT chk_tax_rate_non_negative
  CHECK (COALESCE(tax_rate, 0) >= 0);

-- Discount value must be non-negative
ALTER TABLE invoices ADD CONSTRAINT chk_discount_non_negative
  CHECK (COALESCE(discount_value, 0) >= 0);


-- ─── Trigger: prevent financial edits on paid/void invoices ───────────────────

CREATE OR REPLACE FUNCTION prevent_paid_void_financial_edit()
RETURNS TRIGGER AS $$
BEGIN
  -- Only enforce on paid or void invoices
  IF OLD.status NOT IN ('paid', 'void') THEN
    RETURN NEW;
  END IF;

  -- Allow status-only updates (e.g. marking as void from paid is allowed)
  -- Block any change to financial fields
  IF NEW.subtotal IS DISTINCT FROM OLD.subtotal
     OR NEW.total_amount IS DISTINCT FROM OLD.total_amount
     OR NEW.discount_type IS DISTINCT FROM OLD.discount_type
     OR NEW.discount_value IS DISTINCT FROM OLD.discount_value
     OR NEW.tax_rate IS DISTINCT FROM OLD.tax_rate
     OR NEW.tax_amount IS DISTINCT FROM OLD.tax_amount
     OR NEW.currency IS DISTINCT FROM OLD.currency
  THEN
    RAISE EXCEPTION 'Cannot modify financial fields on a % invoice (id: %)', OLD.status, OLD.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach the trigger
DROP TRIGGER IF EXISTS trg_prevent_paid_void_edit ON invoices;
CREATE TRIGGER trg_prevent_paid_void_edit
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION prevent_paid_void_financial_edit();

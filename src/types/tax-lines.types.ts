/**
 * Types for the invoice_tax_lines table.
 * Supports multi-tax region invoices (e.g. State Tax + County Tax).
 */

export type InvoiceTaxLine = {
  id: string;
  invoice_id: string;
  label: string;        // e.g. "State Tax", "VAT", "County Tax"
  rate_bps: number;     // basis points (825 = 8.25%)
  amount_cents: number; // computed tax amount in cents
  sort_order: number;   // display order
  created_at: string | null;
};

export type InvoiceTaxLineInsert = Omit<InvoiceTaxLine, "id" | "created_at"> & {
  id?: string;
  created_at?: string | null;
};

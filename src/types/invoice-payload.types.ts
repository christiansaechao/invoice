/**
 * Typed payload for creating or updating an invoice.
 * All monetary values are in CENTS (sub-units).
 */
export type InvoiceSavePayload = {
  subtotal: number;
  total_amount: number;
  currency: string;
  discount_type: "flat" | "percent";
  /** cents if flat, raw percent number if percent */
  discount_value: number;
  /** basis points — e.g. 825 = 8.25% */
  tax_rate: number;
  /** computed tax in cents */
  tax_amount: number;
  template_id?: string | null;
  notes?: string;
  terms?: string;
  auto_nudge?: boolean;
  nudge_profile?: "chill" | "professional" | "direct";
  work_week_only?: boolean;
  doc_type?: "invoice" | "quote";
  parent_recurring_id?: string | null;
  email_status?: string | null;
  last_email_at?: string | null;
  payment_link?: string | null;
};

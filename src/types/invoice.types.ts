import type { Database } from "./supabase";

export type InvoiceStatus = Database["public"]["Enums"]["invoice_status"];

export type PaymentMethods = {
  stripe: { enabled: boolean };
  paypal: { enabled: boolean; url?: string };
  venmo: { enabled: boolean; username?: string };
  bank: { enabled: boolean; instructions?: string };
};

export type InvoicePaymentStatus = "unpaid" | "pending" | "paid" | "failed";

export type Invoices = Database["public"]["Tables"]["invoices"]["Row"];

export type RecurringInvoiceStatus = "active" | "paused" | "cancelled";

export type RecurringInvoices = Database["public"]["Tables"]["recurring_invoices"]["Row"];

export type InvoicesWithTotals = Omit<Invoices, "payment_methods"> & {
  total_amount_owed: number;
  client_company_name?: string;
  client_contact_name?: string;
  link_clicked_at?: string | null;
  email_opened_at?: string | null;
  last_nudge_at?: string | null;
  nudge_count?: number;
};


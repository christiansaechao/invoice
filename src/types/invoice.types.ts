export type InvoiceStatus = "paid" | "pending" | "overdue";

export type Invoices = {
  id: string;
  user_id: string;
  invoice_number: number;
  status: InvoiceStatus;
  created_at: string;
  updated_at: string;
  client_id?: string;
  invoice_date?: string;
  due_date?: string;
  currency?: string;
  subtotal?: number;
  discount_type?: string;
  discount_value?: number;
  tax_rate?: number;
  tax_amount?: number;
  total_amount?: number;
  notes?: string;
  terms?: string;
  parent_recurring_id?: string | null;
  email_status?: string | null;
  last_email_at?: string | null;
  payment_link?: string | null;
};

export type RecurringInvoiceStatus = "active" | "paused" | "cancelled";

export type RecurringInvoices = {
  id: string;
  user_id: string;
  client_id: string;
  status: RecurringInvoiceStatus;
  frequency: string;
  interval_data?: number | string;
  next_issue_date?: string;
  end_date?: string;
  max_occurrences?: number;
  occurrences_count?: number;
  payment_terms?: string;
  currency?: string;
  tax_rate?: number;
  discount_type?: string;
  discount_value?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type InvoicesWithTotals = {
  id: string;
  invoice_number: number;
  created_at: string;
  updated_at: string;
  status: InvoiceStatus;
  total_amount_owed: number;
  client_id?: string;
  client_company_name?: string;
  client_contact_name?: string;
};

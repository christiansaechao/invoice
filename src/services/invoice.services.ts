import { supabase } from "@/lib/supabase-client";
import type { Row } from "@/types/entries.types";
import type { InvoiceStatus } from "@/types/invoice.types";

export const fetchInvoices = async () => {
  const { data, error } = await supabase.from("invoices").select("*");

  if (error) {
    throw new Error(
      "There was an issue trying to retrieve the current users invoices: " +
        error,
    );
  }

  return data;
};

export const fetchInvoicesWithTotals = async () => {
  const { data, error } = await supabase
    .from("invoices_with_totals")
    .select("*")
    .order("invoice_number", { ascending: true });

  if (error) {
    throw new Error(
      "There was an issue when trying to retrieve all the invoices for the current user: " +
        error,
    );
  }

  return data;
};

export const fetchClients = async () => {
  const { data, error } = await supabase.from("clients").select("*");

  if (error) {
    throw new Error(
      "There was an issue trying to retrieve the clients: " + error.message,
    );
  }

  return data;
};

export const createClient = async (clientData: any) => {
  // Try to grab auth session for user_id mapping
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const insertPayload = user ? { ...clientData, user_id: user.id } : clientData;

  const { data, error } = await supabase
    .from("clients")
    .insert(insertPayload)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
};

export const fetchEntries = async () => {
  const { data, error } = await supabase.from("entries").select("*");

  if (error) {
    throw new Error(
      "There was an issue trying to retrieve the current users entries: " +
        error,
    );
  }

  return data;
};

export const fetchEntriesByInvoiceId = async (invoiceId: string) => {
  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .eq("invoice_id", invoiceId);

  if (error) {
    console.error("Failed to fetch invoice entries:", error);
    return [];
  }

  // Clean DB timestamps (2026-04-01T00:00:00 -> 2026-04-01) for correct HTML <input type="date"> binding
  return (data || []).map((entry: any) => ({
    ...entry,
    service_date: entry.service_date ? entry.service_date.split("T")[0] : "",
  }));
};

export const updateInvoiceEntries = async (invoiceId: string, rows: Row[]) => {
  const { error: deleteError } = await supabase
    .from("entries")
    .delete()
    .eq("invoice_id", invoiceId);

  if (deleteError) {
    return { success: false, error: deleteError.message };
  }

  const formattedRows = rows.map((row) => ({
    invoice_id: invoiceId,
    service_date: row.service_date,
    quantity: row.quantity ? parseFloat(row.quantity.toString()) : null,
    amount: row.amount ? parseFloat(row.amount.toString()) : null,
    description: row.description,
    item_name: row.item_name,
    unit_price: row.unit_price ? parseFloat(row.unit_price.toString()) : null,
    category: row.category,
  }));

  const { data, error: insertError } = await supabase
    .from("entries")
    .insert(formattedRows)
    .select();

  if (insertError) {
    return { success: false, error: insertError.message };
  }

  return { success: true, data };
};


export const saveInvoice = async (
  rows: Row[],
  clientId: string,
  invoiceDate: string,
  dueDate: string,
  invoiceDetails: {
    currency?: string;
    subtotal?: number;
    discount_type?: string;
    discount_value?: number;
    tax_rate?: number;
    tax_amount?: number;
    total_amount?: number;
    auto_nudge?: boolean;
    nudge_profile: "chill" | "professional" | "direct";
    work_week_only: boolean;
    notes?: string;
    terms?: string;
    parent_recurring_id?: string | null;
    template_id?: string | null;
    doc_type?: "invoice" | "quote";
  },
) => {
  // Resolve the authenticated user for the RPC call
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "Not authenticated",
      invoice: null,
      entries: null,
    };
  }

  // ── 1. Create the invoice via the atomic sequence RPC ──────────────────
  // The RPC assigns invoice_number atomically and snapshots payment_link.
  const { data: invoice, error: invoiceError } = await supabase.rpc(
    "create_invoice_with_atomic_number",
    {
      p_user_id:        user.id,
      p_client_id:      clientId        || null,
      p_invoice_date:   invoiceDate     || null,
      p_due_date:       dueDate         || null,
      p_currency:       invoiceDetails.currency       ?? "USD",
      p_subtotal:       invoiceDetails.subtotal        ?? 0,
      p_total_amount:   invoiceDetails.total_amount    ?? 0,
      p_discount_type:  invoiceDetails.discount_type   ?? null,
      p_discount_value: invoiceDetails.discount_value  ?? null,
      p_tax_rate:       invoiceDetails.tax_rate        ?? null,
      p_tax_amount:     invoiceDetails.tax_amount      ?? null,
      p_notes:          invoiceDetails.notes           ?? null,
      p_terms:          invoiceDetails.terms           ?? null,
      p_template_id:    invoiceDetails.template_id     ?? null,
      p_doc_type:       invoiceDetails.doc_type        ?? "invoice",
      p_auto_nudge:     invoiceDetails.auto_nudge      ?? true,
      p_nudge_profile:  invoiceDetails.nudge_profile,
      p_work_week_only: invoiceDetails.work_week_only,
    }
  );

  if (invoiceError) {
    console.error("invoice rpc error", invoiceError);
    return {
      success: false,
      error: invoiceError,
      message: "There was an issue creating an invoice",
      entries: null,
      invoice: null,
    };
  }

  // ── 2. Insert line items against the new invoice ────────────────────────
  const formattedRows = rows.map((row) => ({
    invoice_id: invoice.id,
    service_date: row.service_date,
    quantity: row.quantity ? parseFloat(row.quantity.toString()) : null,
    amount: row.amount ? parseFloat(row.amount.toString()) : null,
    description: row.description,
    item_name: row.item_name,
    unit_price: row.unit_price ? parseFloat(row.unit_price.toString()) : null,
    category: row.category,
  }));

  const { data: entries, error: entriesError } = await supabase
    .from("entries")
    .insert(formattedRows)
    .select();

  if (entriesError) {
    return {
      success: false,
      error: entriesError,
      message: "There was an issue creating the entries for the invoice",
      entries: null,
      invoice: null,
    };
  }

  return {
    success: true,
    message: "Successfully created new invoice",
    error: null,
    entries,
    invoice,  // includes server-assigned invoice_number
  };
};

export const updateInvoiceStatus = async (
  invoiceId: string,
  status: InvoiceStatus,
) => {
  const { data, error } = await supabase
    .from("invoices")
    .update({ status })
    .eq("id", invoiceId)
    .select()
    .single();

  if (error) {
    console.error("Failed to update invoice status:", error);
    return { success: false, error: error.message };
  }
  return { success: true, data };
};

export const updateFullInvoice = async (
  invoiceId: string,
  clientId: string,
  invoiceNumber: string,
  rows: Row[],
  invoiceDate: string,
  dueDate: string,
  invoiceDetails: {
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
    template_id?: string | null;
  },
) => {
  const { error: invErr } = await supabase
    .from("invoices")
    .update({
      client_id: clientId || null,
      invoice_number: invoiceNumber ? parseInt(invoiceNumber, 10) : null,
      invoice_date: invoiceDate || null,
      due_date: dueDate || null,
      ...invoiceDetails,
    })
    .eq("id", invoiceId);

  if (invErr) {
    console.error("Failed to update base invoice details:", invErr);
    return { success: false, error: invErr.message };
  }

  // Transactionally map entry cascade onto successfully patched parent
  const entriesRes = await updateInvoiceEntries(invoiceId, rows);
  return entriesRes;
};

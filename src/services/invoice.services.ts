import { supabase } from "@/lib/supabase-client";
import type { Row } from "@/types/entries.types";
import type { InvoiceStatus } from "@/types/invoice.types";
import type { InvoiceSavePayload } from "@/types/invoice-payload.types";

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
    .from("invoices")
    .select("*, client:clients(company_name, contact_name)")
    .order("invoice_number", { ascending: true });

  if (error) {
    throw new Error(
      "There was an issue when trying to retrieve all the invoices for the current user: " +
        error,
    );
  }

  return (data || []).map((inv: any) => ({
    ...inv,
    total_amount_owed: inv.total_amount || 0,
    client_company_name: inv.client?.company_name,
    client_contact_name: inv.client?.contact_name,
  }));
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

  return data;
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
    quantity: entry.quantity?.toString() || "",
    unit_price: entry.unit_price ? (entry.unit_price / 100).toFixed(2) : "",
    amount: entry.amount ? (entry.amount / 100).toFixed(2) : "",
  }));
};

export const fetchInvoiceHistory = async (invoiceId: string) => {
  const [emails, nudges, payments] = await Promise.all([
    supabase.from("invoice_email_events").select("*").eq("invoice_id", invoiceId).order("created_at", { ascending: false }),
    supabase.from("nudge_history").select("*").eq("invoice_id", invoiceId).order("sent_at", { ascending: false }),
    supabase.from("invoice_payments").select("*").eq("invoice_id", invoiceId).order("created_at", { ascending: false }),
  ]);

  const history = [
    ...(emails.data || []).map(e => ({ ...e, event_type: 'email' as const, timestamp: e.created_at })),
    ...(nudges.data || []).map(n => ({ ...n, event_type: 'nudge' as const, timestamp: n.sent_at })),
    ...(payments.data || []).map(p => ({ ...p, event_type: 'payment' as const, timestamp: p.created_at })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return history;
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
    amount: row.amount
      ? Math.round(parseFloat(row.amount.toString()) * 100)
      : null,
    description: row.description,
    item_name: row.item_name,
    unit_price: row.unit_price
      ? Math.round(parseFloat(row.unit_price.toString()) * 100)
      : null,
    category: row.category,
  }));

  const { data, error: insertError } = await supabase
    .from("entries")
    .insert(formattedRows as any[])
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
  invoiceDetails: InvoiceSavePayload,
) => {
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

  // Format the JSON payload for the RPC
  const jsonEntries = rows.map((row) => ({
    service_date: row.service_date,
    quantity: row.quantity ? parseFloat(row.quantity.toString()) : 0,
    unit_price: row.unit_price
      ? Math.round(parseFloat(row.unit_price.toString()) * 100)
      : 0,
    amount: row.amount
      ? Math.round(parseFloat(row.amount.toString()) * 100)
      : 0,
    description: row.description || "",
    item_name: row.item_name || "",
    category: row.category || "service",
  }));

  // Single RPC call for atomicity
  const { data, error } = await supabase.rpc(
    "create_invoice_with_atomic_number",
    {
      p_user_id: user.id,
      p_client_id: clientId || null,
      p_invoice_date: invoiceDate || null,
      p_due_date: dueDate || null,
      p_currency: invoiceDetails.currency ?? "USD",
      p_subtotal: invoiceDetails.subtotal ?? 0,
      p_total_amount: invoiceDetails.total_amount ?? 0,
      p_discount_type: invoiceDetails.discount_type ?? null,
      p_discount_value: invoiceDetails.discount_value ?? null,
      p_tax_rate: invoiceDetails.tax_rate ?? null,
      p_tax_amount: invoiceDetails.tax_amount ?? null,
      p_notes: invoiceDetails.notes ?? null,
      p_terms: invoiceDetails.terms ?? null,
      p_template_id: invoiceDetails.template_id ?? null,
      p_doc_type: invoiceDetails.doc_type ?? "invoice",
      p_auto_nudge: invoiceDetails.auto_nudge ?? true,
      p_nudge_profile: invoiceDetails.nudge_profile,
      p_work_week_only: invoiceDetails.work_week_only,
      p_entries: jsonEntries,
    } as any,
  );

  if (error) {
    console.error("Atomic invoice creation error:", error);
    return {
      success: false,
      error,
      message: "Failed to create invoice and entries",
      entries: null,
      invoice: null,
    };
  }

  // data will be { invoice: {...}, entries: [...] }
  const responseData = data as any;
  return {
    success: true,
    message: "Successfully created new invoice and entries",
    error: null,
    entries: responseData?.entries,
    invoice: responseData?.invoice,
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

export const deleteInvoice = async (invoiceId: string) => {
  const { error } = await supabase.from("invoices").delete().eq("id", invoiceId);

  if (error) {
    console.error("Failed to delete invoice:", error);
    return { success: false, error: error.message };
  }
  return { success: true };
};

export const updateFullInvoice = async (
  invoiceId: string,
  clientId: string,
  invoiceNumber: string,
  rows: Row[],
  invoiceDate: string,
  dueDate: string,
  invoiceDetails: Partial<InvoiceSavePayload>,
) => {
  const { error: invErr } = await supabase
    .from("invoices")
    .update({
      client_id: clientId || null,
      invoice_number: invoiceNumber ? parseInt(invoiceNumber, 10) : null,
      invoice_date: invoiceDate || null,
      due_date: dueDate || null,
      ...invoiceDetails,
    } as any)
    .eq("id", invoiceId);

  if (invErr) {
    console.error("Failed to update base invoice details:", invErr);
    return { success: false, error: invErr.message };
  }

  // Transactionally map entry cascade onto successfully patched parent
  const entriesRes = await updateInvoiceEntries(invoiceId, rows);
  return entriesRes;
};

export const sendInvoiceEmail = async (
  invoiceData: any,
  recipientEmail: string,
  accessToken: string,
) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/emailer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      template_id: invoiceData.templateId,
      recipientEmail,
      invoiceData,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to dispatch email");
  }

  return response.json();
};

import { supabase } from "@/lib/supabase-client";

// ─── Types ───────────────────────────────────────────────────────────────────

export type PaymentRecord = {
  id: string;
  invoice_id: string;
  amount: number;         // cents — positive for payments, negative for refunds
  payment_method: string | null;
  status: string | null;
  paid_at: string | null;
  stripe_session_id: string | null;
  payment_intent_id: string | null;
  created_at: string | null;
};

export type InvoiceBalance = {
  totalAmountCents: number;
  totalPaidCents: number;
  totalRefundedCents: number;
  balanceDueCents: number;
};

// ─── Queries ─────────────────────────────────────────────────────────────────

/**
 * Fetch all payment records for an invoice.
 */
export async function fetchPaymentsByInvoiceId(
  invoiceId: string,
): Promise<PaymentRecord[]> {
  const { data, error } = await supabase
    .from("invoice_payments")
    .select("*")
    .eq("invoice_id", invoiceId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch payments:", error);
    return [];
  }

  return data || [];
}

/**
 * Fetch the computed balance for an invoice using the DB function.
 */
export async function fetchInvoiceBalance(
  invoiceId: string,
): Promise<InvoiceBalance | null> {
  const { data, error } = await supabase.rpc("get_invoice_balance", {
    p_invoice_id: invoiceId,
  });

  if (error) {
    console.error("Failed to fetch invoice balance:", error);
    return null;
  }

  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return null;

  return {
    totalAmountCents: Number(row.total_amount_cents),
    totalPaidCents: Number(row.total_paid_cents),
    totalRefundedCents: Number(row.total_refunded_cents),
    balanceDueCents: Number(row.balance_due_cents),
  };
}

// ─── Mutations ───────────────────────────────────────────────────────────────

/**
 * Record a payment against an invoice.
 * Amount should be in cents. Positive = payment, negative = refund.
 */
export async function recordPayment(params: {
  invoiceId: string;
  amountCents: number;
  paymentMethod?: string;
  stripeSessionId?: string;
  paymentIntentId?: string;
}): Promise<{ success: boolean; error?: string; data?: PaymentRecord }> {
  const { data, error } = await supabase
    .from("invoice_payments")
    .insert({
      invoice_id: params.invoiceId,
      amount: params.amountCents,
      payment_method: params.paymentMethod || null,
      stripe_session_id: params.stripeSessionId || null,
      payment_intent_id: params.paymentIntentId || null,
      status: "completed",
      paid_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to record payment:", error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

/**
 * Record a refund against an invoice.
 * This is just a negative payment event.
 */
export async function recordRefund(params: {
  invoiceId: string;
  amountCents: number;         // positive number — will be stored as negative
  paymentMethod?: string;
  stripeSessionId?: string;
  paymentIntentId?: string;
  reason?: string;
}): Promise<{ success: boolean; error?: string; data?: PaymentRecord }> {
  return recordPayment({
    ...params,
    amountCents: -Math.abs(params.amountCents), // ensure negative
    paymentMethod: params.paymentMethod || "refund",
  });
}

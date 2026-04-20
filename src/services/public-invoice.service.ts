import type { PublicInvoiceDocument } from "@/types/public-invoice.types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

/**
 * Fetch a public-safe invoice/quote document by ID.
 * No authentication required.
 */
export async function fetchPublicInvoice(
  id: string
): Promise<PublicInvoiceDocument> {
  const res = await fetch(`${API_URL}/api/invoices/${id}/public`);

  if (res.status === 404) {
    throw new Error("Document not found");
  }
  if (!res.ok) {
    const payload = await res.json().catch(() => null);
    throw new Error(payload?.error ?? `Request failed (${res.status})`);
  }

  const json = await res.json();
  return json.document as PublicInvoiceDocument;
}

/**
 * Convert a quote to an invoice.
 * No authentication required — the document ID is the access token.
 */
export async function convertQuote(
  id: string
): Promise<{ id: string; doc_type: string; status: string; invoice_number: string }> {
  const res = await fetch(`${API_URL}/api/invoices/${id}/convert`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => null);
    throw new Error(payload?.error ?? `Conversion failed (${res.status})`);
  }

  const json = await res.json();
  return json.invoice;
}

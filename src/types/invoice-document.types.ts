import type { PaymentMethods } from "./invoice.types";

export type InvoiceTemplateSlug =
  | "standard"
  | "minimal"
  | "professional"
  | "creative"
  | "luxury_editorial"
  | "clean_minimalist"
  | "modern_studio"
  | "botanical";

export type InvoiceDocumentLineItem = {
  serviceDate: string;
  itemName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  category?: string | null;
};

export type InvoiceDocumentParty = {
  name: string;
  secondary?: string;
  addressLine1?: string;
  addressLine2?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
};

/** @readonly Totals are computed at write-time. Renderers must not recalculate. */
export type InvoiceDocumentTotals = {
  subtotal: number;
  total: number;
  discountAmt?: number;
  taxAmt?: number;
  paid?: number;
  balanceDue?: number;
  currency: string;
  hourlyRate?: number;
};

export type InvoiceDocumentData = {
  invoiceId: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  status?: string;
  paymentLink?: string | null;
  paymentMethods?: PaymentMethods | null;
  stripeSessionId?: string | null;
  paymentStatus?: string;

  templateSlug: InvoiceTemplateSlug;
  from: InvoiceDocumentParty;
  billTo: InvoiceDocumentParty;
  lineItems: InvoiceDocumentLineItem[];
  totals: InvoiceDocumentTotals;
  notes?: string;
  terms?: string;
};

import type { Database } from "./supabase";

/** Public-safe invoice/quote document returned by GET /invoices/:id/public */

export type PublicLineItem = {
  serviceDate: string;
  itemName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  category: string | null;
};

export type PublicClientInfo = {
  companyName: string;
  contactName: string;
  addressLine1: string;
  addressLine2: string;
  phone: string;
  email: string;
};

export type PublicSellerInfo = {
  fullName: string;
  companyName: string;
  address: string;
  city: string;
  state: string;
  areaCode: string;
  phone: string;
  email: string;
  logoUrl: string | null;
};

export type PublicInvoiceDocument = {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  status: Database["public"]["Enums"]["invoice_status"];
  paymentStatus: Database["public"]["Enums"]["invoice_status"] | string;
  paidAt: string | null;
  paymentLink: string | null;
  totalAmount: number;
  subtotal: number;
  currency: string;
  docType: Database["public"]["Enums"]["document_type"];
  templateSlug: string;
  notes: string | null;
  terms: string | null;
  lineItems: PublicLineItem[];
  client: PublicClientInfo | null;
  seller: PublicSellerInfo | null;
};

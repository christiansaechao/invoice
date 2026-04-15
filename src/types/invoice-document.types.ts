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

export type InvoiceDocumentTotals = {
  subtotal: number;
  total: number;
  currency: string;
  hourlyRate?: number;
};

export type InvoiceDocumentData = {
  invoiceId: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  templateSlug: InvoiceTemplateSlug;
  from: InvoiceDocumentParty;
  billTo: InvoiceDocumentParty;
  lineItems: InvoiceDocumentLineItem[];
  totals: InvoiceDocumentTotals;
  notes?: string;
  terms?: string;
};

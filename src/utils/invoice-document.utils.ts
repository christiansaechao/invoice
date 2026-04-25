import type { Row } from "@/types/entries.types";
import type { InvoiceDocumentData, InvoiceDocumentLineItem, InvoiceTemplateSlug } from "@/types/invoice-document.types";
import type { ProfileType } from "@/types/user.types";
import type { BillToInfo } from "@/store/settings.store";

type BuildInvoiceDocumentInput = {
  invoiceId?: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  templateSlug: InvoiceTemplateSlug;
  rows: Row[];
  subtotal: number;
  total: number;
  discountAmt?: number;
  currency?: string;
  fromProfile?: ProfileType | null;
  billTo?: BillToInfo;
  notes?: string;
  terms?: string;
};

function parseMoney(value: string | number | null | undefined) {
  if (typeof value === "number") return value;
  return Number.parseFloat(value ?? "") || 0;
}

function buildLineItems(rows: Row[]): InvoiceDocumentLineItem[] {
  return rows.map((row) => ({
    serviceDate: row.service_date || "",
    itemName: row.item_name || "",
    description: row.description || "",
    quantity: parseMoney(row.quantity),
    unitPrice: parseMoney(row.unit_price),
    amount: parseMoney(row.amount),
    category: row.category,
  }));
}

export function buildInvoiceDocumentData({
  invoiceId = "preview",
  invoiceNumber,
  invoiceDate,
  dueDate,
  templateSlug,
  rows,
  subtotal,
  total,
  discountAmt,
  currency = "USD",
  fromProfile,
  billTo,
  notes,
  terms,
}: BuildInvoiceDocumentInput): InvoiceDocumentData {
  const fullName = `${fromProfile?.first_name ?? ""} ${fromProfile?.last_name ?? ""}`.trim() || "Your Business";

  return {
    invoiceId,
    invoiceNumber,
    invoiceDate,
    dueDate,
    templateSlug,
    from: {
      name: fullName,
      addressLine1: fromProfile?.address ?? "",
      addressLine2: [fromProfile?.city, fromProfile?.state, fromProfile?.area_code]
        .filter(Boolean)
        .join(", "),
      phone: fromProfile?.phone_number ?? "",
      email: fromProfile?.preferred_email ?? "",
      logoUrl: fromProfile?.brand_logo_url ?? undefined,
    },
    billTo: {
      name: billTo?.companyName || billTo?.manager || "Client",
      secondary: billTo?.companyName && billTo?.manager ? billTo.manager : undefined,
      addressLine1: billTo?.addressLine1 ?? "",
      addressLine2: billTo?.addressLine2 ?? "",
      phone: billTo?.phoneNumber ?? "",
    },
    lineItems: buildLineItems(rows),
    totals: {
      subtotal,
      total,
      discountAmt,
      currency,
    },
    notes,
    terms,
  };
}

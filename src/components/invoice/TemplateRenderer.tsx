import type { InvoiceDocumentData } from "@/types/invoice-document.types";
import { ArtisanLayout } from "./layouts/ArtisanLayout";
import { BotanicalLayout } from "./layouts/BotanicalLayout";
import { CleanMinimalistSpaLayout } from "./layouts/CleanMinimalistSpaLayout";
import { LuxuryEditorialLayout } from "./layouts/LuxuryEditorialLayout";
import { MinimalLayout } from "./layouts/MinimalLayout";
import { ModernCorporateLayout } from "./layouts/ModernCorporateLayout";
import { ModernStudioLayout } from "./layouts/ModernStudioLayout";
import { StandardLayout } from "./layouts/StandardLayout";

type TemplateRendererProps = {
  document: InvoiceDocumentData;
};

function toLegacyData(document: InvoiceDocumentData) {
  return {
    invoiceNumber: document.invoiceNumber,
    date: document.invoiceDate,
    dueDate: document.dueDate,
    billToOverride: {
      companyName: document.billTo.name,
      manager: document.billTo.secondary ?? "",
      addressLine1: document.billTo.addressLine1 ?? "",
      addressLine2: document.billTo.addressLine2 ?? "",
      phoneNumber: document.billTo.phone ?? "",
    },
    rows: document.lineItems.map((lineItem) => ({
      service_date: lineItem.serviceDate,
      item_name: lineItem.itemName,
      description: lineItem.description,
      quantity: lineItem.quantity,
      unit_price: lineItem.unitPrice,
      amount: lineItem.amount,
      category: lineItem.category ?? null,
    })),
    hourlyRate: String(document.totals.hourlyRate ?? ""),
    subtotal: document.totals.subtotal,
    total: document.totals.total,
  };
}

export function TemplateRenderer({ document }: TemplateRendererProps) {
  const data = toLegacyData(document);

  switch (document.templateSlug) {
    case "minimal":
      return <MinimalLayout data={data} />;
    case "professional":
      return <ModernCorporateLayout data={data} />;
    case "creative":
      return <ArtisanLayout data={data} />;
    case "luxury_editorial":
      return <LuxuryEditorialLayout data={data} />;
    case "clean_minimalist":
      return <CleanMinimalistSpaLayout data={data} />;
    case "modern_studio":
      return <ModernStudioLayout data={data} />;
    case "botanical":
      return <BotanicalLayout data={data} />;
    case "standard":
    default:
      return <StandardLayout data={data} />;
  }
}

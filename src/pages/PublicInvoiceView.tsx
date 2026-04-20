import { useParams } from "react-router-dom";
import { useState } from "react";
import { FileSearch, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { usePublicInvoice, useConvertQuote } from "@/api/public-invoice.api";
import { PublicViewLayout } from "@/components/invoice/PublicViewLayout";
import { PublicStickyBar } from "@/components/invoice/PublicStickyBar";
import { TemplateRenderer } from "@/components/invoice/TemplateRenderer";
import type { InvoiceDocumentData, InvoiceTemplateSlug } from "@/types/invoice-document.types";
import type { PublicInvoiceDocument } from "@/types/public-invoice.types";

// ── Helpers ────────────────────────────────────────────────────────────────

/** Map the flat public document into the shape TemplateRenderer expects */
function toInvoiceDocumentData(doc: PublicInvoiceDocument): InvoiceDocumentData {
  return {
    invoiceId: doc.id,
    invoiceNumber: doc.invoiceNumber,
    invoiceDate: doc.invoiceDate,
    dueDate: doc.dueDate,
    status: doc.status,
    paymentLink: doc.paymentLink,
    paymentStatus: doc.paymentStatus,
    templateSlug: (doc.templateSlug as InvoiceTemplateSlug) ?? "standard",
    from: {
      name: doc.seller?.companyName || doc.seller?.fullName || "—",
      secondary: doc.seller?.fullName,
      addressLine1: doc.seller?.address,
      addressLine2: [doc.seller?.city, doc.seller?.state, doc.seller?.areaCode]
        .filter(Boolean)
        .join(", "),
      phone: doc.seller?.phone,
      email: doc.seller?.email,
      logoUrl: doc.seller?.logoUrl ?? undefined,
    },
    billTo: {
      name: doc.client?.companyName || doc.client?.contactName || "—",
      secondary: doc.client?.companyName ? doc.client.contactName : undefined,
      addressLine1: doc.client?.addressLine1,
      addressLine2: doc.client?.addressLine2,
      phone: doc.client?.phone,
      email: doc.client?.email,
    },
    lineItems: doc.lineItems.map((li) => ({
      serviceDate: li.serviceDate,
      itemName: li.itemName,
      description: li.description,
      quantity: li.quantity,
      unitPrice: li.unitPrice,
      amount: li.amount,
      category: li.category,
    })),
    totals: {
      subtotal: doc.subtotal,
      total: doc.totalAmount,
      currency: doc.currency,
    },
    notes: doc.notes ?? undefined,
    terms: doc.terms ?? undefined,
  };
}

// ── Loading skeleton ────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
        <p className="text-sm text-muted-foreground font-medium">Loading document…</p>
      </div>
    </div>
  );
}

// ── 404 / Branded error state ───────────────────────────────────────────────

function DocumentNotFound({ message }: { message?: string }) {
  const isNotFound = !message || message === "Document not found";
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-2xl bg-muted/60 border border-border flex items-center justify-center mx-auto mb-6">
          {isNotFound ? (
            <FileSearch className="w-9 h-9 text-muted-foreground" />
          ) : (
            <AlertTriangle className="w-9 h-9 text-amber-500" />
          )}
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2 tracking-tight">
          {isNotFound ? "Document Not Found" : "Something Went Wrong"}
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
          {isNotFound
            ? "This invoice or quote link may have expired or the ID is incorrect. Please contact the sender for a new link."
            : message}
        </p>
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground/60 font-medium uppercase tracking-widest">
          <span>Secured by</span>
          <span className="font-bold text-foreground/40">Receipts</span>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────

export function PublicInvoiceView() {
  const { id } = useParams<{ id: string }>();
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: doc, isLoading, error } = usePublicInvoice(id);
  const convertMutation = useConvertQuote(id);

  // ── Event handlers ──────────────────────────────────────────────────────

  const handlePay = () => {
    if (!doc?.paymentLink) return;
    window.open(doc.paymentLink, "_blank", "noopener,noreferrer");
  };

  const handleConvert = async () => {
    try {
      await convertMutation.mutateAsync();
      toast.success("Quote approved! This document has been converted to an invoice.");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to convert quote. Please try again.");
    }
  };

  const handleDownloadPdf = async () => {
    if (!id) return;
    setIsDownloading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
      const res = await fetch(`${apiUrl}/api/pdf/${id}`, { method: "GET" });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.error ?? `PDF generation failed (${res.status})`);
      }

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const contentDisposition = res.headers.get("Content-Disposition");
      const filenameMatch = contentDisposition?.match(/filename\*?=(?:UTF-8'')?([^;]+)/i);
      a.href = objectUrl;
      a.download = filenameMatch?.[1]?.trim() ?? `Document_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    } catch (err: any) {
      toast.error(err?.message ?? "Could not generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────

  if (isLoading) return <LoadingSkeleton />;

  if (error || !doc) {
    return <DocumentNotFound message={(error as Error | null)?.message} />;
  }

  const documentData = toInvoiceDocumentData(doc);
  const isConverting = convertMutation.isPending;

  return (
    <>
      {/* Main layout + desktop sidebar */}
      <PublicViewLayout
        document={doc}
        isConverting={isConverting}
        isDownloading={isDownloading}
        onPay={handlePay}
        onConvert={handleConvert}
        onDownloadPdf={handleDownloadPdf}
      >
        {/* Wrap the renderer's output in the swipeable table scope */}
        <div className="table-scroll-wrapper">
          <TemplateRenderer document={documentData} />
        </div>
      </PublicViewLayout>

      {/* Mobile sticky payment bar — hidden on md+ */}
      <PublicStickyBar
        docType={doc.docType}
        paymentStatus={doc.paymentStatus}
        totalAmount={doc.totalAmount}
        currency={doc.currency}
        paymentLink={doc.paymentLink}
        isConverting={isConverting}
        onPay={handlePay}
        onConvert={handleConvert}
      />

      {/* Bottom padding spacer so content never hides behind the sticky bar on mobile */}
      <div className="h-[88px] md:hidden" aria-hidden="true" />
    </>
  );
}

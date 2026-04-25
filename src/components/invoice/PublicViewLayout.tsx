import { useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  Download,
  FileSignature,
  Loader2,
  Receipt,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PublicInvoiceDocument } from "@/types/public-invoice.types";

interface PublicViewLayoutProps {
  document: PublicInvoiceDocument;
  children: React.ReactNode; // The TemplateRenderer canvas
  isConverting: boolean;
  onPay: () => void;
  onConvert: () => void;
  onDownloadPdf: () => void;
  isDownloading: boolean;
  isRestricted?: boolean;
}

const formatCurrency = (amount: number, currency: string) =>
  amount.toLocaleString("en-US", { style: "currency", currency });

export function PublicViewLayout({
  document: doc,
  children,
  isConverting,
  isDownloading,
  isRestricted = false,
  onPay,
  onConvert,
  onDownloadPdf,
}: PublicViewLayoutProps) {
  const isPaid = doc.paymentStatus === "paid";
  const isQuote = doc.docType === "quote";

  const watermarkText = isQuote ? "ESTIMATE / NOT FINAL" : "DRAFT / NOT SENT";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Top nav bar */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Receipt className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground tracking-tight">
              Receipts
            </span>
            <span className="text-muted-foreground/40 font-light mx-1">·</span>
            <span className="text-xs text-muted-foreground capitalize">
              {isQuote ? "Quote" : "Invoice"} #{doc.invoiceNumber}
            </span>
          </div>

          {isPaid && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              PAID
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-8 items-start">
          {/* ── Document Canvas ── */}
          <div className="flex-1 min-0">
            {/* Mobile swipe hint appears above canvas on small screens */}
            <p className="text-[11px] text-center text-muted-foreground/60 mb-3 md:hidden">
              Swipe the table to view all columns →
            </p>

            {/* Canvas: glassmorphic card wrapping the TemplateRenderer */}
            <div
              className={cn(
                "public-canvas bg-white rounded-2xl shadow-2xl shadow-slate-900/8 ring-1 ring-slate-900/5 overflow-hidden relative",
                isRestricted && "restricted-watermark"
              )}
              /* Bottom padding clears sticky bar on mobile */
              style={{ paddingBottom: "0" }}
            >
              {/* Swipeable table scope — overflow-x-auto applied here via CSS child scope */}
              <style>{`
                .public-canvas table {
                  min-width: 560px;
                }
                .public-canvas .table-scroll-wrapper {
                  overflow-x: auto;
                  -webkit-overflow-scrolling: touch;
                  position: relative;
                }
                .public-canvas .table-scroll-wrapper::after {
                  content: '';
                  position: absolute;
                  top: 0;
                  right: 0;
                  bottom: 0;
                  width: 40px;
                  background: linear-gradient(to left, rgba(255,255,255,0.9), transparent);
                  pointer-events: none;
                  border-radius: 0 0 1rem 0;
                }
                .restricted-watermark::after {
                  content: '${watermarkText}';
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%) rotate(-30deg);
                  font-size: clamp(3rem, 8vw, 6rem);
                  font-weight: 900;
                  color: rgba(0, 0, 0, 0.04);
                  white-space: nowrap;
                  pointer-events: none;
                  user-select: none;
                  z-index: 50;
                  width: 150%;
                  text-align: center;
                }
              `}</style>
              {children}
            </div>

            {/* Below-table swipe hint for desktop-sized tables */}
            <p className="text-[10px] text-center text-muted-foreground/50 mt-3 hidden md:block">
              {doc.lineItems.length} line item{doc.lineItems.length !== 1 ? "s" : ""}
            </p>
            <p className="text-[10px] text-center text-muted-foreground/50 mt-1 md:hidden">
              Swipe table left to view all columns
            </p>
          </div>

          {/* ── Desktop Sidebar ── */}
          <aside className="hidden md:flex flex-col gap-3 w-52 flex-shrink-0 sticky top-20">
            {/* Seller info pill */}
            {doc.seller && (
              <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-1">
                {doc.seller.logoUrl ? (
                  <img
                    src={doc.seller.logoUrl}
                    alt="Seller logo"
                    className="w-10 h-10 object-contain rounded-lg border border-border mb-2"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <span className="text-primary font-bold text-sm uppercase">
                      {(doc.seller.companyName || doc.seller.fullName)?.[0] ?? "R"}
                    </span>
                  </div>
                )}
                <p className="text-sm font-semibold text-foreground leading-tight">
                  {doc.seller.companyName || doc.seller.fullName}
                </p>
                {doc.seller.email && (
                  <p className="text-xs text-muted-foreground truncate">{doc.seller.email}</p>
                )}
              </div>
            )}

            {/* Total due card */}
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">
                Total Due
              </p>
              <p className="text-2xl font-black tabular-nums text-foreground leading-none">
                {formatCurrency(doc.totalAmount, doc.currency)}
              </p>
              {doc.dueDate && (
                <p className="text-xs text-muted-foreground mt-2">
                  Due{" "}
                  {new Date(doc.dueDate + "T00:00:00").toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>

            {/* Paid badge or CTA */}
            {isPaid ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex flex-col items-center gap-2 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                <span className="text-emerald-800 font-bold text-sm uppercase tracking-wider">
                  Payment Received
                </span>
                {doc.paidAt && (
                  <span className="text-xs text-emerald-700/70">
                    {new Date(doc.paidAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
            ) : isQuote ? (
              <Button
                id="desktop-approve-quote-btn"
                onClick={onConvert}
                disabled={isConverting}
                className="w-full h-11 bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-md shadow-violet-200 gap-2"
              >
                {isConverting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FileSignature className="w-4 h-4" />
                )}
                {isConverting ? "Converting…" : "Approve Quote"}
              </Button>
            ) : !isRestricted && (
              <Button
                id="desktop-pay-invoice-btn"
                onClick={onPay}
                disabled={!doc.paymentLink}
                className="w-full h-11 bg-primary hover:bg-primary/90 font-bold shadow-md shadow-primary/20 gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Pay Invoice
              </Button>
            )}

            {/* Download PDF — prominent secondary action */}
            <div className="relative group">
              <Button
                id="desktop-download-pdf-btn"
                variant="outline"
                onClick={onDownloadPdf}
                disabled={isDownloading || isRestricted}
                className="w-full h-11 font-semibold border-2 gap-2"
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {isDownloading ? "Generating…" : "Download PDF"}
              </Button>
              {isRestricted && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Finalize invoice to download PDF
                </div>
              )}
            </div>

            {/* Doc type badge */}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted/50 border border-border/50">
              <FileText className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
                {isQuote ? "Quote Document" : "Invoice Document"}
              </span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Pencil, Download, MoreVertical, AlertTriangle, Loader2 } from "lucide-react";
import type { InvoicesWithTotals, InvoiceStatus } from "@/types/invoice.types";
import { StatusDropdown, STATUS_CONFIG } from "./InvoiceStatusDropdown";
import { useUser } from "@/store/user.store";
import { downloadInvoicePdf } from "@/services/pdf.services";
import { toast } from "sonner";

// ─── Avatar helpers ───────────────────────────────────────────────────────────

const AVATAR_CLASSES = [
  { bg: "bg-accent", text: "text-accent-foreground" },
  { bg: "bg-secondary", text: "text-secondary-foreground" },
  { bg: "bg-muted", text: "text-primary" },
  { bg: "bg-primary/10", text: "text-primary" },
];

export function avatarSlot(name?: string) {
  const idx = (name?.charCodeAt(0) ?? 0) % AVATAR_CLASSES.length;
  const letters = (name || "?")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  return { letters, ...AVATAR_CLASSES[idx] };
}

// ─── Row Component ────────────────────────────────────────────────────────────

export interface InvoiceRichListRowProps {
  inv: InvoicesWithTotals;
  status: InvoiceStatus;
  isSaving: boolean;
  onEdit: (inv: InvoicesWithTotals) => void;
  onStatusChange: (next: InvoiceStatus) => void;
}

export function InvoiceRichListRow({
  inv,
  status,
  isSaving,
  onEdit,
  onStatusChange,
}: InvoiceRichListRowProps) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const avatar = avatarSlot(inv.client_company_name);
  const { session } = useUser();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    if (!session?.access_token || isDownloading) {
      if (!session?.access_token) {
        toast.error("You must be logged in to download a PDF.");
      }
      return;
    }

    setIsDownloading(true);

    try {
      await downloadInvoicePdf(inv.id, session.access_token);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "PDF download failed";
      console.error("PDF download failed:", error);
      toast.error(message);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 px-5 py-4 hover:bg-accent/20 transition-colors last:rounded-b-xl">
      {/* Left accent bar — colour reflects current status */}
      <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${cfg.barClass}`} />

      {/* Brand avatar */}
      <div
        className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-bold tracking-wide ${avatar.bg} ${avatar.text}`}
      >
        {avatar.letters}
      </div>

      {/* Company + contact */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-foreground text-sm leading-tight truncate">
          {inv.client_company_name || "Unknown Client"}
        </p>
        {inv.client_contact_name && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {inv.client_contact_name}
          </p>
        )}
      </div>

      {/* Created Date */}
      <div className="hidden md:block w-[100px] flex-shrink-0">
        <p className="tabular-nums text-xs text-muted-foreground">
          {new Date(inv.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </p>
      </div>

      {/* Due Date (Assuming Net 30 for visualization) */}
      <div className="hidden lg:block w-[100px] flex-shrink-0">
        <p className="tabular-nums text-xs text-muted-foreground">
          {new Date(new Date(inv.created_at).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </p>
      </div>

      {/* Invoice number */}
      <div className="hidden sm:block w-[100px] flex-shrink-0">
        <p className="font-mono text-xs text-muted-foreground">
          #{inv.invoice_number}
        </p>
      </div>

      {/* Amount */}
      <div className="w-[100px] flex-shrink-0 text-right pr-4">
        <span className={`font-bold text-sm tabular-nums ${cfg.amountClass}`}>
          {(inv.total_amount_owed || 0).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </span>
      </div>

      {/* Status dropdown */}
      <div className="w-[120px] flex-shrink-0">
        <StatusDropdown
          status={status}
          disabled={isSaving}
          onChange={onStatusChange}
        />
      </div>

      {/* Context actions — vary by status */}
      <div className="flex items-center gap-1 flex-shrink-0 w-[110px] justify-end">
        {status === "paid" && (
          <>
            <button
              onClick={() => onEdit(inv)}
              className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
              title="View / Edit"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={isDownloading ? "Generating PDF..." : "Download PDF"}
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
            </button>
          </>
        )}

        {status === "pending" && (
          <>
            <span className="text-[10px] font-bold tracking-widest uppercase text-secondary-foreground">
              REMIND
            </span>
            <button
              onClick={() => onEdit(inv)}
              className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
              title="Edit invoice"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </>
        )}

        {status === "overdue" && (
          <>
            <button
              onClick={() => onEdit(inv)}
              className="bg-destructive text-destructive-foreground text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity leading-tight"
            >
              REMIND
            </button>
            <button
              onClick={() => onEdit(inv)}
              className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
              title="Edit"
            >
              <AlertTriangle className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

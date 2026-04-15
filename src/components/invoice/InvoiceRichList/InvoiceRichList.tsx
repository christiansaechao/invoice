import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import type { InvoicesWithTotals, InvoiceStatus } from "@/types/invoice.types";
import { updateInvoiceStatus } from "@/services/invoice.services";
import { toast } from "sonner";
import { InvoiceRichListRow } from "./InvoiceRichListRow";

// ─── Props ────────────────────────────────────────────────────────────────────

export interface InvoiceRichListProps {
  invoices: InvoicesWithTotals[];
  isLoading?: boolean;
  onEdit: (inv: InvoicesWithTotals) => void;
  /** Called after a successful Supabase write so the parent can re-fetch */
  onRefresh: () => void;
  emptyMessage?: string;
}

// ─── Main component ───────────────────────────────────────────────────────────

export function InvoiceRichList({
  invoices,
  isLoading = false,
  onEdit,
  onRefresh,
  emptyMessage = "No invoices match your filters.",
}: InvoiceRichListProps) {

  const [localStatuses, setLocalStatuses] = useState<Record<string, InvoiceStatus>>({});

  const [saving, setSaving] = useState<Set<string>>(new Set());

  function getStatus(inv: InvoicesWithTotals): InvoiceStatus {
    return localStatuses[inv.id] ?? inv.status ?? "pending";
  }

  async function handleStatusChange(inv: InvoicesWithTotals, next: InvoiceStatus) {
    try {
      const prev = getStatus(inv);
      if (prev === next) return;

      setLocalStatuses((s) => ({ ...s, [inv.id]: next }));
      setSaving((s) => new Set(s).add(inv.id));

      const { success, error } = await updateInvoiceStatus(inv.id, next);

      setSaving((s) => { const n = new Set(s); n.delete(inv.id); return n; });

      if (!success) {
        setLocalStatuses((s) => ({ ...s, [inv.id]: prev }));
        toast.error(`Backend Error: ${error || "Failed to update db"}`);
      } else {
        toast.success(`Invoice marked as ${next}.`);
        onRefresh();
      }
    } catch (err: any) {
      toast.error(`Exception triggered: ${err.message || err}`);
      setSaving((s) => { const n = new Set(s); n.delete(inv.id); return n; });
    }
  }

  // ── Loading / empty states ─────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoaderCircle className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  // ── Rows ───────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col bg-card rounded-xl border border-border shadow-sm">
      {/* Custom Table Header Row */}
      <div className="flex items-center gap-4 px-5 py-3 bg-muted/40 border-b border-border text-[10px] font-bold tracking-widest uppercase text-muted-foreground rounded-t-xl">
        {/* Offset for accent bar (w-1) and avatar (w-10) */}
        <div className="w-1 flex-shrink-0" />
        <div className="w-10 flex-shrink-0" />

        {/* Content headers aligned to row grid */}
        <div className="flex-1 min-w-0">Company</div>
        <div className="hidden md:block w-[100px] flex-shrink-0">Created Date</div>
        <div className="hidden lg:block w-[100px] flex-shrink-0">Due Date</div>
        <div className="hidden sm:block w-[100px] flex-shrink-0">Invoice #</div>
        <div className="w-[100px] flex-shrink-0 text-right pr-4">Total</div>
        <div className="w-[120px] flex-shrink-0 text-center">Status</div>
        <div className="w-[110px] flex-shrink-0 text-right">Actions</div>
      </div>

      {/* Row list */}
      <div className="flex flex-col divide-y divide-border">
        {invoices.map((inv) => (
          <InvoiceRichListRow
            key={inv.id}
            inv={inv}
            status={getStatus(inv)}
            isSaving={saving.has(inv.id)}
            onEdit={onEdit}
            onStatusChange={(next) => handleStatusChange(inv, next)}
          />
        ))}
      </div>
    </div>
  );
}

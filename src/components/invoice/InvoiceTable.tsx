import { LoaderCircle, Pencil } from "lucide-react";
import type { InvoicesWithTotals } from "@/types/invoice.types";
import type { InvoiceStatus } from "@/types/invoice.types";

interface InvoiceTableProps {
  invoices: InvoicesWithTotals[];
  isLoading?: boolean;
  /** Cap the number of rows shown (e.g. 4 for the dashboard). Omit for no limit. */
  limit?: number;
  onToggleStatus: (id: string, next: InvoiceStatus) => void;
  onEdit: (inv: InvoicesWithTotals) => void;
  /** Show the pencil edit column. Defaults to true. */
  showEdit?: boolean;
  emptyMessage?: string;
  readOnlyStatus?: boolean;
}

export function InvoiceTable({
  invoices,
  isLoading = false,
  limit,
  onToggleStatus,
  onEdit,
  showEdit = true,
  readOnlyStatus = false,
  emptyMessage = "No invoices match your filters.",
}: InvoiceTableProps) {
  const rows = limit ? invoices.slice(0, limit) : invoices;
  const colSpan = showEdit ? 6 : 5;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className="py-3 px-4 text-left text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
              Invoice ID
            </th>
            <th className="py-3 px-4 text-left text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
              Date
            </th>
            <th className="py-3 px-4 text-left text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
              Client
            </th>
            <th className="py-3 px-4 text-right text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
              Total
            </th>
            <th className="py-3 px-4 text-center text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
              Status
            </th>
            {showEdit && <th className="py-3 px-4 w-[52px]" />}
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={colSpan} className="py-12 text-center">
                <LoaderCircle className="w-7 h-7 animate-spin text-primary mx-auto" />
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={colSpan} className="py-12 text-center text-muted-foreground text-sm">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows?.map((inv) => (
              <tr
                key={inv.id}
                className="border-b border-border/50 last:border-0 hover:bg-accent/30 transition-colors"
              >
                {/* Invoice # */}
                <td className="py-3.5 px-4 font-mono text-xs font-medium text-muted-foreground">
                  {inv.invoice_number}
                </td>

                {/* Date */}
                <td className="py-3.5 px-4 text-muted-foreground tabular-nums text-xs">
                  {new Date(inv.created_at).toLocaleDateString()}
                </td>

                {/* Client */}
                <td className="py-3.5 px-4">
                  {inv.client_company_name ? (
                    <div className="flex flex-col leading-tight">
                      <span className="font-semibold text-foreground">{inv.client_company_name}</span>
                      {inv.client_contact_name && (
                        <span className="text-xs text-muted-foreground">{inv.client_contact_name}</span>
                      )}
                    </div>
                  ) : (
                    <span className="italic text-muted-foreground opacity-50">Unknown Client</span>
                  )}
                </td>

                {/* Total */}
                <td className="py-3.5 px-4 text-right tabular-nums font-semibold text-foreground">
                  {((inv.total_amount_owed || 0) / 100).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </td>

                {/* Status toggle */}
                <td className="py-3.5 px-4 text-center">
                  {readOnlyStatus ? (
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                        inv.status === "paid"
                          ? "bg-secondary text-secondary-foreground"
                          : inv.status === "overdue"
                          ? "bg-destructive text-destructive-foreground"
                          : "bg-muted text-muted-foreground border border-border"
                      }`}
                    >
                      {inv.status || "pending"}
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        const current = inv.status || "pending";
                        const next: InvoiceStatus = current === "paid" ? "pending" : "paid";
                        onToggleStatus(inv.id, next);
                      }}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase transition-opacity hover:opacity-75 cursor-pointer ${
                        inv.status === "paid"
                          ? "bg-secondary text-secondary-foreground"
                          : inv.status === "overdue"
                          ? "bg-destructive text-destructive-foreground"
                          : "bg-muted text-muted-foreground border border-border"
                      }`}
                    >
                      {inv.status || "pending"}
                    </button>
                  )}
                </td>

                {/* Edit button */}
                {showEdit && (
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => onEdit(inv)}
                      title="Edit Invoice"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors text-muted-foreground hover:text-primary hover:bg-accent"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

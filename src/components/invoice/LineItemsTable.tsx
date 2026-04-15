// LineItemsTable — the printable invoice line-items preview.
// Used inside the print-area of NewInvoice and EditInvoiceModal.
import { useSettings } from "@/store/settings.store";
import type { Row } from "@/types/entries.types";

interface LineItemsTableProps {
  rows: Row[];
}

export function LineItemsTable({ rows }: LineItemsTableProps) {
  const { defaultTemplateId } = useSettings();
  const isMinimal = defaultTemplateId === "minimal";

  return (
    <table className={`w-full text-sm border-collapse ${isMinimal ? "mt-8 mb-4" : "mb-2"}`}>
      <thead>
        <tr className={isMinimal ? "border-b-2 border-slate-200" : "bg-muted/40 border-b border-border"}>
          <th className={`text-left py-2 px-3 text-[10px] font-bold tracking-widest uppercase ${isMinimal ? "text-slate-500 w-24" : "text-muted-foreground"}`}>
            Date
          </th>
          <th className={`text-left py-2 px-3 text-[10px] font-bold tracking-widest uppercase ${isMinimal ? "text-slate-500" : "text-muted-foreground"}`}>
            Item
          </th>
          <th className={`text-left py-2 px-3 text-[10px] font-bold tracking-widest uppercase ${isMinimal ? "text-slate-500" : "text-muted-foreground"}`}>
            Description
          </th>
          <th className={`text-right py-2 px-3 text-[10px] font-bold tracking-widest uppercase ${isMinimal ? "text-slate-500 w-16" : "text-muted-foreground"}`}>
            Qty
          </th>
          <th className={`text-right py-2 px-3 text-[10px] font-bold tracking-widest uppercase ${isMinimal ? "text-slate-500 w-24" : "text-muted-foreground"}`}>
            Price
          </th>
          <th className={`text-right py-2 px-3 text-[10px] font-bold tracking-widest uppercase ${isMinimal ? "text-slate-500 w-28" : "text-muted-foreground"}`}>
            Amount
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={4} className="py-6 text-center text-muted-foreground text-xs italic">
              No line items yet.
            </td>
          </tr>
        ) : (
          rows.map((row, i) => (
            <tr key={i} className={`border-b ${isMinimal ? "border-slate-100 last:border-0 hover:bg-slate-50" : "border-border/40 last:border-0"}`}>
              <td className={`py-2 px-3 tabular-nums text-xs ${isMinimal ? "text-slate-500" : "text-muted-foreground"}`}>
                {row.service_date}
              </td>
              <td className={`py-2 px-3 ${isMinimal ? "text-slate-900 font-medium" : "text-foreground"}`}>
                {row.item_name}
              </td>
              <td className={`py-2 px-3 ${isMinimal ? "text-slate-900 font-medium" : "text-foreground"}`}>
                {row.description}
              </td>
              <td className={`py-2 px-3 text-right tabular-nums ${isMinimal ? "text-slate-600" : "text-muted-foreground"}`}>
                {row.quantity}
              </td>
              <td className={`py-2 px-3 text-right tabular-nums font-medium ${isMinimal ? "text-slate-900 font-semibold" : "text-foreground"}`}>
                {Number(row.unit_price || 0).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </td>
              <td className={`py-2 px-3 text-right tabular-nums font-medium ${isMinimal ? "text-slate-900 font-semibold" : "text-foreground"}`}>
                {Number(row.amount || 0).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

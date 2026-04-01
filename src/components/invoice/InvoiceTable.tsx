import React from "react";
import type { Row } from "@/types/entries.types";

export function InvoiceTable({ rows }: { rows: Row[] }) {
  return (
    <table className="w-full border-separate border-spacing-0 overflow-hidden rounded-xl border border-border bg-white shadow-sm mt-6">
      <thead className="bg-slate-50">
        <tr>
          <th className="text-left text-xs text-muted-foreground py-3 px-4 border-b border-border tracking-wider font-semibold font-sans">Date</th>
          <th className="text-right text-xs text-muted-foreground py-3 px-4 border-b border-border tracking-wider font-semibold font-sans">Hours Worked</th>
          <th className="text-right text-xs text-muted-foreground py-3 px-4 border-b border-border tracking-wider font-semibold font-sans">Amount Owed</th>
        </tr>
      </thead>

      <tbody id="invoiceRows">
        {rows.map((row, i) => {
          const isLast = i === rows.length - 1;
          const borderClass = isLast && !row.description ? "border-0" : "border-b border-slate-100";
          
          return (
            <React.Fragment key={i}>
              <tr>
                <td className={`p-3 px-4 align-top ${borderClass}`}>{row.work_date}</td>
                <td className={`p-3 px-4 align-top text-right tabular-nums ${borderClass}`}>{row.hours}</td>
                <td className={`p-3 px-4 align-top text-right tabular-nums font-medium ${borderClass}`}>
                  {row.amount_owed ? `$${row.amount_owed}` : ""}
                </td>
              </tr>
              {row.description && (
                <tr>
                  <td 
                    colSpan={3} 
                    className={`px-4 pb-4 pt-1 text-sm text-muted-foreground whitespace-pre-wrap align-top ${isLast ? "border-0" : "border-b border-slate-100"}`}
                  >
                    {row.description}
                  </td>
                </tr>
              )}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
}

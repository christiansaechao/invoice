import React from "react";
import AutoGrowTextarea from "./AutoGrowTextarea";
import type { InvoiceTableProps } from "@/types/entries.types";

export function InvoiceTable({ rows, updateRow }: InvoiceTableProps) {
  return (
    <table className="w-full">
      <thead>
        <tr>
          <th>Date</th>
          <th className="num">Hours Worked</th>
          <th className="num">Amount Owed</th>
        </tr>
      </thead>

      <tbody id="invoiceRows">
        {rows.map((row, i) => (
          <React.Fragment key={i}>
            <tr>
              <td>
                <input
                  className="w-full"
                  type="date"
                  value={row.work_date}
                  onChange={(e) => updateRow(i, "work_date", e.target.value)}
                  required
                />
              </td>
              <td>
                <input
                  className="w-full"
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="0"
                  value={row.hours}
                  onChange={(e) => updateRow(i, "hours", e.target.value)}
                  required
                />
              </td>
              <td>
                <input
                  className="w-full"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={row.amount_owed}
                  onChange={(e) => updateRow(i, "amount_owed", e.target.value)}
                  required
                />
              </td>
            </tr>

            <tr>
              <td colSpan={3} className="border-b border-line">
                <AutoGrowTextarea
                  value={row.description}
                  onChange={(v) => updateRow(i, "description", v)}
                  placeholder="What you worked on..."
                />
              </td>
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}

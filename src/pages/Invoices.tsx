import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/invoice/Header";
import type { InvoicesWithTotals } from "@/types/invoice.types";
import { supabase } from "@/lib/supabase-client";
import { LoaderCircle } from "lucide-react";
import { fetchInvoicesWithTotals } from "@/services/invoice.services";

export default function Invoices() {
  const [invoices, setInvoices] = useState<InvoicesWithTotals[]>([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const invoices = await fetchInvoicesWithTotals();

        console.log(invoices);

        if (cancelled) return;

        if (!invoices || invoices.length === 0) {
          setInvoices([]);
          return;
        }

        setInvoices(invoices);
      } catch (e) {
        if (cancelled) return;
        throw new Error(
          "There was an issue trying to retrieve your invoices: " + e,
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="page">
      <div className="topbar">
        <Header />
      </div>

      <div className="content">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Invoices</h2>
          <Link to="/dashboard/invoices/new" className="btn primary">
            Create New Invoice
          </Link>
        </div>

        <table className="w-full">
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "10px" }}>Invoice ID</th>
              <th style={{ textAlign: "left", padding: "10px" }}>Date</th>
              <th style={{ textAlign: "left", padding: "10px" }}>Client</th>
              <th style={{ textAlign: "right", padding: "10px" }}>Total</th>
              <th style={{ textAlign: "center", padding: "10px" }}>Status</th>
            </tr>
          </thead>

          <tbody>
            {invoices &&
              invoices.map((inv) => (
                <tr
                  key={inv.id}
                  style={{ borderBottom: "1px solid var(--line)" }}
                >
                  <td style={{ padding: "10px" }}>{inv.invoice_number}</td>
                  <td style={{ padding: "10px" }}>
                    {new Date(inv.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "10px" }}>TEMP</td>
                  <td style={{ padding: "10px", textAlign: "right" }}>
                    ${inv.total_amount_owed.toFixed(2)}
                  </td>
                  <td style={{ padding: "10px", textAlign: "center" }}>
                    <span
                      className="py-2 px-4 rounded-full"
                      style={{
                        backgroundColor:
                          inv.completed === true ? "#d4edda" : "#f8d7da",
                        color: inv.completed === true ? "#155724" : "#721c24",
                      }}
                    >
                      {inv.completed ? "complete" : "incomplete"}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {!invoices.length && (
          <LoaderCircle className="w-10 h-10 animate-spin text-blue-500" />
        )}
      </div>
    </div>
  );
}

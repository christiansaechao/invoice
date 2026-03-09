import { useState, useMemo } from "react";
import { Header } from "../components/invoice/Header";
import { MetaInfo } from "../components/invoice/MetaInfo";
import { BillTo } from "../components/invoice/BillTo";
import { FromInfo } from "../components/invoice/FromInfo";
import { InvoiceTable } from "../components/invoice/InvoiceTable";
import { Totals } from "../components/invoice/Totals";
import { saveInvoice } from "@/services/invoice.services";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import type { Row } from "@/types/entries.types";

export function NewInvoice() {
  // Meta State
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [date, setDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Table State
  const [rows, setRows] = useState<Row[]>([
    { work_date: "", description: "", hours: "", amount_owed: "" },
  ]);

  // Totals State
  const [hourlyRate, setHourlyRate] = useState("");

  // Updates a single field in a row
  const updateRow = (index: number, field: keyof Row, value: string) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };
    setRows(newRows);
  };

  const addRow = () => {
    setRows([
      ...rows,
      { work_date: "", description: "", hours: "", amount_owed: "" },
    ]);
  };

  // Auto-calc logic: updates 'owed' for all rows based on hours * rate
  const autoCalc = () => {
    const rate = parseFloat(hourlyRate) || 0;

    const newRows = rows.map((row) => {
      const h = parseFloat(row.hours) || 0;
      if (h && rate) {
        return { ...row, amount_owed: (h * rate).toFixed(2) };
      }
      return row;
    });

    setRows(newRows);
  };

  const saveNewInvoice = async () => {
    const { message } = await saveInvoice(rows);
    toast(message);
  };

  const printInvoice = async () => {
    await autoCalc();
    window.print();
  };

  // Computed Totals
  const { subtotal, total } = useMemo(() => {
    const sub = rows.reduce((acc, row) => {
      const val = parseFloat(row.amount_owed) || 0;
      return acc + val;
    }, 0);
    return { subtotal: sub, total: sub }; // discount/tax are 0 for now
  }, [rows]);

  return (
    <div id="print-area" className="page">
      <div className="topbar">
        <Header />
        <MetaInfo
          invoiceNumber={invoiceNumber}
          setInvoiceNumber={setInvoiceNumber}
          date={date}
          setDate={setDate}
          dueDate={dueDate}
          setDueDate={setDueDate}
        />
      </div>

      <div className="content">
        <div className="grid">
          <BillTo />
          <FromInfo />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              className="btn no-print"
              type="button"
              onClick={printInvoice}
            >
              Print / Save PDF
            </button>
            <button
              className="btn primary no-print"
              type="button"
              onClick={autoCalc}
            >
              Auto-calc totals
            </button>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="btn no-print" type="button" onClick={addRow}>
              + Add Entry
            </button>
            <button className="btn no-print" type="submit" form="invoice-form">
              Save Invoice
            </button>
          </div>
        </div>

        <form
          id="invoice-form"
          onSubmit={(e) => {
            e.preventDefault();
            saveNewInvoice();
          }}
        >
          <InvoiceTable rows={rows} updateRow={updateRow} />
        </form>

        <Totals
          hourlyRate={hourlyRate}
          setHourlyRate={setHourlyRate}
          subtotal={subtotal}
          discount={0}
          tax={0}
          total={total}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          padding: "18px 28px 26px",
          color: "var(--foreground)",
          fontSize: "12px",
        }}
      >
        <div>
          Make checks payable to <strong>Christian Saechao</strong>
        </div>
        <div>Thank you for your business.</div>
      </div>

      <Toaster />
    </div>
  );
}

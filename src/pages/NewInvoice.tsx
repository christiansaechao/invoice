import { useState, useMemo, useEffect } from "react";
import { Header } from "../components/invoice/Header";
import { MetaInfo } from "../components/invoice/MetaInfo";
import { BillTo } from "../components/invoice/BillTo";
import { FromInfo } from "../components/invoice/FromInfo";
import { InvoiceTable } from "../components/invoice/InvoiceTable";
import { Totals } from "../components/invoice/Totals";
import { Footer } from "../components/invoice/Footer";
import { InvoiceDetailsForm } from "../components/invoice/InvoiceDetailsForm";
import { LineItemsForm } from "../components/invoice/LineItemsForm";
import { InvoiceActionButtons } from "../components/invoice/InvoiceActionButtons";
import { saveInvoice, fetchClients, fetchLastInvoiceNumberByClient } from "@/services/invoice.services";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import type { Row } from "@/types/entries.types";
import {
  calculateTotals,
  getBillToOverride,
} from "@/utils/invoice.utils";
import { useLineItems } from "@/hooks/useLineItems";

export function NewInvoice() {
  // Meta State
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [date, setDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Client Selection State
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");

  useEffect(() => {
    fetchClients()
      .then((data) => {
        setClients(data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch clients", err);
      });
  }, []);

  // Sync latest client sequence number continuously
  useEffect(() => {
    if (!selectedClientId) {
      setInvoiceNumber("");
      return;
    }

    fetchLastInvoiceNumberByClient(selectedClientId).then((lastNum) => {
      if (lastNum !== null && !isNaN(Number(lastNum))) {
        setInvoiceNumber(String(Number(lastNum) + 1));
      } else {
        // Safe standard fallback entry if it's their first invoice
        setInvoiceNumber("1");
      }
    });
  }, [selectedClientId]);

  const selectedClient = clients.find((c) => c.id === selectedClientId);
  const billToOverride = getBillToOverride(selectedClient);

  const handleClientCreated = (newClient: any) => {
    setClients((prev) => [...prev, newClient]);
    setSelectedClientId(newClient.id);
  };

  const {
    rows,
    hourlyRate,
    setHourlyRate,
    updateRow,
    addRow,
    removeRow,
    autoCalc
  } = useLineItems();

  const saveNewInvoice = async () => {
    if (!selectedClientId) {
      toast("Please select a client before saving the invoice.");
      return;
    }
    const { message } = await saveInvoice(rows, selectedClientId, invoiceNumber);
    toast(message);
  };

  const printInvoice = () => {
    // We execute the auto calc over the actual hook rows immediately before print
    autoCalc();

    // Give react 1 tick to flush state to dom before snapping PDF
    setTimeout(() => {
      window.print();
    }, 150);
  };

  // Computed Totals
  const { subtotal, total } = useMemo(() => calculateTotals(rows), [rows]);

  return (
    <div className="flex flex-col xl:flex-row gap-8 items-start h-full pb-8">
      {/* Left Panel: Form */}
      <div className="w-full xl:w-[450px] flex-shrink-0 flex flex-col gap-6 bg-card border border-border p-6 rounded-xl shadow-sm no-print">
        <InvoiceDetailsForm
          clients={clients}
          selectedClientId={selectedClientId}
          setSelectedClientId={setSelectedClientId}
          onClientCreated={handleClientCreated}
          invoiceNumber={invoiceNumber}
          setInvoiceNumber={setInvoiceNumber}
          date={date}
          setDate={setDate}
          dueDate={dueDate}
          setDueDate={setDueDate}
        />
        <LineItemsForm
          rows={rows}
          hourlyRate={hourlyRate}
          setHourlyRate={setHourlyRate}
          updateRow={updateRow}
          removeRow={removeRow}
          addRow={addRow}
          autoCalc={autoCalc}
        />
        <InvoiceActionButtons
          saveNewInvoice={saveNewInvoice}
          printInvoice={printInvoice}
        />
      </div>

      {/* Right Panel: Preview Area */}
      <div className="flex-1 w-full flex justify-center overflow-x-auto rounded-xl shadow-sm border border-border border-b-0">
        <div id="print-area" className="bg-white m-0 min-w-[700px] w-full max-w-[850px] !shadow-none !border-0 rounded-xl overflow-hidden">
          <div className="flex gap-5 justify-between items-start pt-7 px-7 pb-4 bg-gradient-to-br from-white to-slate-50 border-b border-border">
            <Header />
            <MetaInfo
              invoiceNumber={invoiceNumber}
              date={date}
              dueDate={dueDate}
            />
          </div>

          <div className="pt-5 px-7 pb-2.5">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <BillTo override={billToOverride} />
              <FromInfo />
            </div>

            <InvoiceTable rows={rows} />

            <Totals
              hourlyRate={hourlyRate}
              subtotal={subtotal}
              discount={0}
              tax={0}
              total={total}
            />
          </div>

          <Footer />
        </div>
      </div>

      <Toaster />
    </div>
  );
}

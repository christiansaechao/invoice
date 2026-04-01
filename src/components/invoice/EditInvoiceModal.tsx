import { useState, useMemo, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Header } from "./Header";
import { MetaInfo } from "./MetaInfo";
import { BillTo } from "./BillTo";
import { FromInfo } from "./FromInfo";
import { InvoiceTable } from "./InvoiceTable";
import { Totals } from "./Totals";
import { Footer } from "./Footer";
import { InvoiceDetailsForm } from "./InvoiceDetailsForm";
import { LineItemsForm } from "./LineItemsForm";
import { Button } from "@/components/ui/button";
import { Save, Loader2, Printer } from "lucide-react";
import { fetchClients, fetchEntriesByInvoiceId, updateFullInvoice } from "@/services/invoice.services";
import { toast } from "sonner";
import { calculateTotals, getBillToOverride } from "@/utils/invoice.utils";
import { useLineItems } from "@/hooks/useLineItems";
import type { InvoicesWithTotals } from "@/types/invoice.types";

export function EditInvoiceModal({
  isOpen,
  onClose,
  invoice,
  onSaveSuccess
}: {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoicesWithTotals | null;
  onSaveSuccess: () => void;
}) {
  const [isDeploying, setIsDeploying] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  
  // Generic states mapping the builder
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [date, setDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");

  const {
    rows,
    setRows,
    hourlyRate,
    setHourlyRate,
    updateRow,
    addRow,
    removeRow,
    autoCalc
  } = useLineItems([]);

  // Initialization Hydrating Hooks
  useEffect(() => {
    if (isOpen) {
      fetchClients().then((data) => setClients(data || []));
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && invoice) {
      setInvoiceNumber(String(invoice.invoice_number || ""));
      setSelectedClientId(invoice.client_id || "");
      // Re-hydrate the date using the identical date-stripper used in components/services explicitly matching `<input type="date">`
      setDate(invoice.created_at ? invoice.created_at.split('T')[0] : "");
      
      setIsFetching(true);
      fetchEntriesByInvoiceId(invoice.id).then(fetchedEntries => {
         setRows(fetchedEntries.length > 0 ? fetchedEntries : []);
         setIsFetching(false);
      });
    } else {
      // Flush form if closed
      setInvoiceNumber("");
      setSelectedClientId("");
      setDate("");
      setRows([]);
    }
  }, [isOpen, invoice, setRows]);

  const selectedClient = clients.find((c) => c.id === selectedClientId);
  const billToOverride = getBillToOverride(selectedClient);

  const handleClientCreated = (newClient: any) => {
    setClients((prev) => [...prev, newClient]);
    setSelectedClientId(newClient.id);
  };

  const handleSave = async () => {
    if (!invoice || !selectedClientId) {
      toast.error("Please ensure a Client is selected.");
      return;
    }
    
    setIsDeploying(true);
    // Force auto calculations explicitly prior to database push to prevent stale totals
    autoCalc();

    setTimeout(async () => {
       const res = await updateFullInvoice(invoice.id, selectedClientId, invoiceNumber, rows);
       setIsDeploying(false);
       
       if (res.success) {
         toast.success("Successfully updated invoice.");
         onSaveSuccess();
         onClose();
       } else {
         toast.error(res.error || "Failed to update record.");
       }
    }, 50);
  };

  const printInvoice = () => {
    autoCalc();
    setTimeout(() => { window.print(); }, 150);
  };

  const { subtotal, total } = useMemo(() => calculateTotals(rows), [rows]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* Visual map rendering the screen at a solid 1200px max spread. bg-slate block mapping the preview split. pb ensures internal scroll handles correctly */}
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 overflow-y-auto bg-slate-50/50 flex flex-col xl:flex-row shadow-2xl">
        {/* Hidden screen readers elements preventing standard shadcn accessibility warning bounds */}
        <DialogTitle className="sr-only">Edit Invoice</DialogTitle>
        <DialogDescription className="sr-only">Editor module for updating an invoice record.</DialogDescription>
        
        {/* Left Side: Real Forms */}
        <div className="w-full xl:w-[480px] bg-white border-r border-border flex flex-col h-full flex-shrink-0 relative">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-slate-50/50 sticky top-0 z-10">
             <div>
               <h2 className="text-lg font-semibold tracking-tight text-foreground">Editing Invoice <span className="text-muted-foreground font-mono font-medium">#{invoice?.invoice_number}</span></h2>
             </div>
             <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={printInvoice} title="Print Invoice / Save PDF" className="h-8 w-8">
                  <Printer className="w-4 h-4" />
                </Button>
                <Button size="sm" onClick={handleSave} disabled={isDeploying || isFetching || !invoice} className="h-8">
                  {isDeploying ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  Save
                </Button>
             </div>
          </div>

          <div className="p-6 flex flex-col gap-6 flex-1 overflow-y-auto">
             {isFetching ? (
               <div className="flex items-center justify-center flex-1">
                 <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
               </div>
             ) : (
                <>
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
                </>
             )}
          </div>
        </div>

        {/* Right Side: Print Document Display */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center items-start">
           <div id="print-area" className="bg-white min-w-full lg:min-w-[700px] max-w-[850px] shadow-lg border border-border rounded-xl overflow-hidden pointer-events-none scale-100 lg:scale-[0.85] origin-top">
             <div className="flex gap-5 justify-between items-start pt-7 px-7 pb-4 bg-gradient-to-br from-white to-slate-50 border-b border-border">
                <Header />
                <MetaInfo invoiceNumber={invoiceNumber} date={date} dueDate={dueDate} />
             </div>
             <div className="pt-5 px-7 pb-2.5">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <BillTo override={billToOverride} />
                  <FromInfo />
                </div>
                <InvoiceTable rows={rows} />
                <Totals hourlyRate={hourlyRate} subtotal={subtotal} discount={0} tax={0} total={total} />
             </div>
             <Footer />
           </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

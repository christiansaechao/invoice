import { Button } from "@/components/ui/button";
import { Printer, Save } from "lucide-react";

type InvoiceActionButtonsProps = {
  saveNewInvoice: () => void;
  printInvoice: () => void;
};

export function InvoiceActionButtons({
  saveNewInvoice,
  printInvoice
}: InvoiceActionButtonsProps) {
  return (
    <div className="flex items-center justify-end gap-3 w-full">
      <Button variant="outline" className="gap-2" onClick={printInvoice}>
        <Printer className="h-4 w-4" /> Print / PDF
      </Button>
      <Button className="gap-2" onClick={saveNewInvoice}>
        <Save className="h-4 w-4" /> Save Invoice
      </Button>
    </div>
  );
}

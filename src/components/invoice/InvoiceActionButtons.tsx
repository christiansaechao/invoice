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
    <div className="border-t border-border pt-6 flex flex-col gap-3 mt-auto">
      <Button className="w-full gap-2" onClick={saveNewInvoice}>
        <Save className="h-4 w-4" /> Save Invoice
      </Button>
      <Button variant="outline" className="w-full gap-2" onClick={printInvoice}>
        <Printer className="h-4 w-4" /> Print / Save PDF
      </Button>
    </div>
  );
}

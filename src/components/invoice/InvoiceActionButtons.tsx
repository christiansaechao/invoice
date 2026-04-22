import { Button } from "@/components/ui/button";
import { Printer, Save, Mail, Loader2 } from "lucide-react";

type InvoiceActionButtonsProps = {
  saveNewInvoice: () => void;
  printInvoice: () => void;
  onSend: () => void;
  isSending?: boolean;
  disabled?: boolean;
};

export function InvoiceActionButtons({
  saveNewInvoice,
  printInvoice,
  onSend,
  isSending = false,
  disabled
}: InvoiceActionButtonsProps) {
  return (
    <div className="flex items-center justify-end gap-3 w-full">
      <Button variant="outline" className="gap-2" onClick={printInvoice}>
        <Printer className="h-4 w-4" /> Print / PDF
      </Button>
      <Button variant="secondary" className="gap-2" onClick={onSend} disabled={disabled || isSending}>
        {isSending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Mail className="h-4 w-4" />
        )}
        Send to Client
      </Button>
      <Button className="gap-2" onClick={saveNewInvoice} disabled={disabled}>
        <Save className="h-4 w-4" /> Save Invoice
      </Button>
    </div>
  );
}

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateClientModal } from "./CreateClientModal";

type InvoiceDetailsFormProps = {
  clients: any[];
  selectedClientId: string;
  setSelectedClientId: (id: string) => void;
  onClientCreated: (client: any) => void;
  invoiceNumber: string;
  setInvoiceNumber: (num: string) => void;
  date: string;
  setDate: (date: string) => void;
  dueDate: string;
  setDueDate: (date: string) => void;
};

export function InvoiceDetailsForm({
  clients,
  selectedClientId,
  setSelectedClientId,
  onClientCreated,
  invoiceNumber,
  setInvoiceNumber,
  date,
  setDate,
  dueDate,
  setDueDate
}: InvoiceDetailsFormProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-w-0">
      <h2 className="text-2xl font-bold tracking-tight mb-4">Invoice Details</h2>
      <div className="flex flex-col gap-4 min-w-0">
        {/* Client Selector */}
        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex items-center justify-between">
            <Label htmlFor="client-select">Select Client</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-primary"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="h-3 w-3 mr-1" /> New
            </Button>
          </div>
          <select
            id="client-select"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 truncate"
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
          >
            <option value="">-- Settings Default --</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.company_name} ({c.contact_name})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 min-w-0">
          <Label htmlFor="invno">Invoice Number</Label>
          <Input
            id="invno"
            placeholder="1"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            className="truncate"
          />
        </div>
        <div className="flex flex-row gap-4">
          <div className="flex flex-col gap-2 w-full min-w-0">
            <Label htmlFor="date">Invoice Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="truncate"
            />
          </div>
          <div className="flex flex-col gap-2 w-full min-w-0">
            <Label htmlFor="due">Due Date</Label>
            <Input
              id="due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="truncate"
            />
          </div>
        </div>
      </div>

      <CreateClientModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onClientCreated={onClientCreated}
      />
    </div>
  );
}

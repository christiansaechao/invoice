import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateClientModal } from "./CreateClientModal";

import { SUPPORTED_CURRENCIES } from "@/lib/currency";
import { usePlanLimits } from "@/hooks/usePlanLimits";

type InvoiceDetailsFormProps = {
  clients: any[];
  selectedClientId: string;
  setSelectedClientId: (id: string) => void;
  onClientCreated: (client: any) => void;
  invoiceNumber: string;
  // setInvoiceNumber removed — number is now assigned by the DB RPC
  currency: string;
  setCurrency: (code: string) => void;
  dueDate: string;
  setDueDate: (date: string) => void;
  templateId?: string;
  setTemplateId?: (id: string) => void;
};

export function InvoiceDetailsForm({
  clients,
  selectedClientId,
  setSelectedClientId,
  onClientCreated,
  invoiceNumber,
  currency,
  setCurrency,
  dueDate,
  setDueDate,
  templateId,
  setTemplateId,
}: InvoiceDetailsFormProps) {
  const [showClientModal, setShowClientModal] = useState(false);
  const { canAddClient, activeClientCount, limits } = usePlanLimits();

  return (
    <div className="min-w-0">
      <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-6">
        Logistics
      </h2>
      <div className="flex flex-col gap-4 min-w-0">
        {/* Client Selector */}
        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex items-center justify-between">
            <Label htmlFor="client-select">Select Client</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!canAddClient}
              className="h-6 px-2 text-xs text-primary"
              onClick={() => setShowClientModal(true)}
            >
              <Plus className="h-3 w-3 mr-1" />
              Quick Add
            </Button>
          </div>

          {!canAddClient && (
            <p className="text-[9px] text-amber-500 font-bold uppercase tracking-tight">
              Limit reached: {activeClientCount}/{limits.activeClients} active
              slots used. Archive a client to free up space.
            </p>
          )}

          <select
            id="client-select"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 truncate"
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
          >
            <option value="">-- Settings Default --</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.company_name} {c.contact_name ? `(${c.contact_name})` : ""}
              </option>
            ))}
          </select>

          <CreateClientModal
            open={showClientModal}
            onOpenChange={setShowClientModal}
            onClientCreated={onClientCreated}
          />
        </div>

        <div className="flex flex-col gap-2 min-w-0">
          <Label htmlFor="invno">Invoice Number</Label>
          <div className="relative">
            <Input
              id="invno"
              value={invoiceNumber}
              readOnly
              placeholder="Auto-generated on save"
              className="bg-muted/40 text-muted-foreground cursor-default select-none"
              tabIndex={-1}
            />
            {!invoiceNumber && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 pointer-events-none">
                Auto
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 min-w-0">
          <Label htmlFor="currency-select">Currency</Label>
          <select
            id="currency-select"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            {SUPPORTED_CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} ({c.symbol})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 min-w-0">
          <Label htmlFor="due-date">Due Date</Label>
          <Input
            id="due-date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, X, Loader2 } from "lucide-react";
import { useCreateClient } from "@/api/client.api";
import { toast } from "sonner";
import { useUser } from "@/store/user.store";

import { useTemplates } from "@/api/templates.api";
import { SUPPORTED_CURRENCIES } from "@/lib/currency";

type InvoiceDetailsFormProps = {
  clients: any[];
  selectedClientId: string;
  setSelectedClientId: (id: string) => void;
  onClientCreated: (client: any) => void;
  invoiceNumber: string;
  setInvoiceNumber: (num: string) => void;
  templateId: string;
  setTemplateId: (id: string) => void;
  currency: string;
  setCurrency: (code: string) => void;
};

export function InvoiceDetailsForm({
  clients,
  selectedClientId,
  setSelectedClientId,
  onClientCreated,
  invoiceNumber,
  setInvoiceNumber,
  templateId,
  setTemplateId,
  currency,
  setCurrency
}: InvoiceDetailsFormProps) {
  const { session } = useUser();
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [qaName, setQaName] = useState("");
  const [qaEmail, setQaEmail] = useState("");
  const createClientMutation = useCreateClient();
  const { data: templates } = useTemplates();

  const handleQuickAdd = async () => {
    if (!qaName.trim()) {
       toast.error("Company name is required");
       return;
    }
    try {
      const data = await createClientMutation.mutateAsync({
         company_name: qaName,
         contact_email: qaEmail,
         user_id: session?.user?.id
      });
      onClientCreated(data);
      setShowQuickAdd(false);
      setQaName("");
      setQaEmail("");
      toast.success("Client added and selected automatically.");
    } catch {
      toast.error("Failed to quick-add client");
    }
  };

  return (
    <div className="min-w-0">
      <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-6">Logistics</h2>
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
              onClick={() => setShowQuickAdd(!showQuickAdd)}
            >
              {showQuickAdd ? <X className="h-3 w-3 mr-1" /> : <Plus className="h-3 w-3 mr-1" />} 
              {showQuickAdd ? "Cancel" : "Quick Add"}
            </Button>
          </div>
          
          {showQuickAdd ? (
             <div className="flex flex-col gap-3 p-4 bg-primary/[0.03] border border-primary/20 rounded-md animate-in slide-in-from-top-2 fade-in">
                 <div className="flex flex-col gap-1.5">
                    <Label className="text-xs text-primary">Company Name</Label>
                    <Input className="h-8" value={qaName} onChange={e => setQaName(e.target.value)} placeholder="Acme Corp" />
                 </div>
                 <div className="flex flex-col gap-1.5">
                    <Label className="text-xs text-primary">Contact Email (Optional)</Label>
                    <Input className="h-8" value={qaEmail} onChange={e => setQaEmail(e.target.value)} placeholder="contact@acme.com" />
                 </div>
                 <Button size="sm" className="w-full mt-1 h-8" onClick={handleQuickAdd} disabled={createClientMutation.isPending}>
                    {createClientMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Plus className="h-3 w-3 mr-2" />} Save & Select
                 </Button>
             </div>
          ) : (
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
          )}
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

      </div>
    </div>
  );
}

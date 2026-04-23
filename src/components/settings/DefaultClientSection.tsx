import { useState, useEffect } from "react";
import { useFetchClients } from "@/api/client.api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CreateClientModal } from "@/components/invoice/CreateClientModal";
import { toast } from "sonner";
import { Save, Loader2, Building2, Plus, RefreshCw, UserCheck } from "lucide-react";
import { useFetchUserSettings, useUpdateUserSettings } from "@/api/settings.api";

export function DefaultClientSection() {
  // React Query
  const { data: userSettings, isLoading: loadingSettings } = useFetchUserSettings();
  const updateDefaultClientMutation = useUpdateUserSettings();
  const { data: clients = [], isLoading: loadingClients, refetch: loadClients } = useFetchClients();

  const [selectedId, setSelectedId] = useState<string>("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const activeClient = clients.find((c: any) => c.id === selectedId) || null;

  const handleSave = async () => {
    if (!selectedId || !activeClient) {
      toast.error("Please select a client first.");
      return;
    }

    try {
      await updateDefaultClientMutation.mutateAsync({ default_client_id: selectedId });
      toast.success("Default client saved.");
    } catch (error) {
      toast.error("Failed to save default client.");
    }
  };

  const handleClientCreated = (newClient: any) => {
    setSelectedId(newClient.id);
    setShowCreateModal(false);
  };

  useEffect(() => {
    if (userSettings?.default_client_id) {
      setSelectedId(userSettings.default_client_id);
    }
  }, [userSettings]);


  return (
    <div className="flex flex-col gap-6 bg-card border border-border p-6 rounded-xl shadow-sm">
      <div>
        <h2 className="text-xl font-bold tracking-tight">"Bill To" Client</h2>
        <p className="text-sm text-muted-foreground">Select your default billing client for invoices.</p>
      </div>

      {loadingClients ? (
        <div className="flex items-center justify-center py-10 text-muted-foreground gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Loading clients…</span>
        </div>
      ) : clients.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
            <Building2 className="w-7 h-7 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground">No clients yet</p>
            <p className="text-sm text-muted-foreground mt-0.5">Add your first client to set a default billing contact.</p>
          </div>
          <Button variant="outline" className="gap-2" onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4" /> Add Client
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {activeClient && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
              <UserCheck className="h-5 w-5 text-green-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-green-800 truncate">{activeClient.company_name}</p>
                {activeClient.contact_name && (
                  <p className="text-xs text-green-600 truncate">{activeClient.contact_name}</p>
                )}
              </div>
              <span className="ml-auto text-[10px] font-bold tracking-widest uppercase text-green-600 bg-green-100 px-2 py-0.5 rounded-full flex-shrink-0">
                Selected
              </span>
            </div>
          )}

          <div className="grid gap-2">
            <Label>Select Client</Label>
            <select
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              value={selectedId}
              onChange={e => setSelectedId(e.target.value)}
            >
              <option value="" disabled>Choose a client…</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.company_name}{c.contact_name ? ` — ${c.contact_name}` : ""}
                </option>
              ))}
            </select>
          </div>

          {activeClient && (
            <div className="p-3 rounded-lg border border-border bg-slate-50 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">{activeClient.company_name}</p>
              {activeClient.contact_name && <p>{activeClient.contact_name}</p>}
              {activeClient.address && <p className="text-xs mt-1">{activeClient.address}</p>}
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowCreateModal(true)}>
              <Plus className="h-3.5 w-3.5" /> Add Client
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 ml-auto text-muted-foreground" onClick={loadClients}>
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </Button>
          </div>
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-border">
        <Button
          onClick={handleSave}
          disabled={updateDefaultClientMutation.isPending || loadingClients || !selectedId}
          className="w-full gap-2"
        >
          {updateDefaultClientMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Default Client
        </Button>
      </div>

      <CreateClientModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onClientCreated={handleClientCreated}
      />
    </div>
  );
}

import { useState, useEffect } from "react";
import { useUser } from "@/store/user.store";
import { updateProfile, fetchProfile, fetchClients } from "@/services/invoice.services";
import { useSettings } from "@/store/settings.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateClientModal } from "@/components/invoice/CreateClientModal";
import { toast } from "sonner";
import { Save, Loader2, Building2, Plus, RefreshCw, UserCheck } from "lucide-react";

export function Settings() {
  const { profile, session, setProfile } = useUser();

  const [savingFrom, setSavingFrom] = useState(false);

  const [fromInfo, setFromInfo] = useState({
    first_name: "",
    last_name: "",
    address: "",
    city: "",
    state: "",
    area_code: "",
    phone_number: "",
    preferred_email: "",
  });

  useEffect(() => {
    if (profile) {
      setFromInfo({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        area_code: profile.area_code || "",
        phone_number: profile.phone_number || "",
        preferred_email: profile.preferred_email || "",
      });
    }
  }, [profile]);

  const handleSaveFrom = async () => {
    if (!session?.user?.id) return;
    setSavingFrom(true);
    try {
      const res = await updateProfile(session.user.id, fromInfo);
      if (res.success) {
        const freshData = await fetchProfile(session.user.id);
        setProfile(freshData);
        toast.success("Profile saved successfully");
      } else {
        toast.error("Failed to update profile: " + res.error?.message);
      }
    } catch {
      toast.error("Error updating profile.");
    } finally {
      setSavingFrom(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your invoice preferences and sender information.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* From Section */}
        <div className="flex flex-col gap-6 bg-card border border-border p-6 rounded-xl shadow-sm">
          <div>
            <h2 className="text-xl font-bold tracking-tight">"From" Details</h2>
            <p className="text-sm text-muted-foreground">Your primary business information shown on invoices.</p>
          </div>

          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>First Name</Label>
                <Input value={fromInfo.first_name} onChange={e => setFromInfo({ ...fromInfo, first_name: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Last Name</Label>
                <Input value={fromInfo.last_name} onChange={e => setFromInfo({ ...fromInfo, last_name: e.target.value })} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Email</Label>
              <Input value={fromInfo.preferred_email} onChange={e => setFromInfo({ ...fromInfo, preferred_email: e.target.value })} />
            </div>

            <div className="grid gap-2">
              <Label>Address</Label>
              <Input value={fromInfo.address} onChange={e => setFromInfo({ ...fromInfo, address: e.target.value })} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2 col-span-2">
                <Label>City</Label>
                <Input value={fromInfo.city} onChange={e => setFromInfo({ ...fromInfo, city: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>State</Label>
                <Input value={fromInfo.state} onChange={e => setFromInfo({ ...fromInfo, state: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Zip/Area Code</Label>
                <Input value={fromInfo.area_code} onChange={e => setFromInfo({ ...fromInfo, area_code: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Phone</Label>
                <Input value={fromInfo.phone_number} onChange={e => setFromInfo({ ...fromInfo, phone_number: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="mt-auto pt-4">
            <Button onClick={handleSaveFrom} disabled={savingFrom} className="w-full gap-2">
              {savingFrom ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save "From" Info
            </Button>
          </div>
        </div>

        {/* Bill To — client picker */}
        <DefaultClientSection />
      </div>
    </div>
  );
}

// ─── Isolated client-picker panel ────────────────────────────────────────────

function DefaultClientSection() {
  const { defaultClientId, setDefaultClientId, setBillTo } = useSettings();

  const [clients, setClients] = useState<any[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [selectedId, setSelectedId] = useState<string>(defaultClientId || "");
  const [saving, setSaving] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadClients = async () => {
    setLoadingClients(true);
    try {
      const data = await fetchClients();
      setClients(data || []);
    } finally {
      setLoadingClients(false);
    }
  };

  useEffect(() => { loadClients(); }, []);

  useEffect(() => {
    if (defaultClientId) setSelectedId(defaultClientId);
  }, [defaultClientId]);

  const activeClient = clients.find(c => c.id === selectedId) || null;
  const defaultClient = clients.find(c => c.id === defaultClientId) || null;

  const handleSave = () => {
    if (!selectedId || !activeClient) {
      toast.error("Please select a client first.");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setDefaultClientId(selectedId);
      // Keep billTo in sync for BillTo.tsx backward compat
      setBillTo({
        manager: activeClient.contact_name || "",
        companyName: activeClient.company_name || "",
        addressLine1: activeClient.address || "",
        addressLine2: `${activeClient.city || ""} ${activeClient.state || ""} ${activeClient.zip_code || ""}`.trim(),
        phoneNumber: activeClient.phone || "",
      });
      toast.success("Default client saved.");
      setSaving(false);
    }, 400);
  };

  const handleClientCreated = (newClient: any) => {
    setClients(prev => [...prev, newClient]);
    setSelectedId(newClient.id);
    setShowCreateModal(false);
  };

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
          {defaultClient && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
              <UserCheck className="h-5 w-5 text-green-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-green-800 truncate">{defaultClient.company_name}</p>
                {defaultClient.contact_name && (
                  <p className="text-xs text-green-600 truncate">{defaultClient.contact_name}</p>
                )}
              </div>
              <span className="ml-auto text-[10px] font-bold tracking-widest uppercase text-green-600 bg-green-100 px-2 py-0.5 rounded-full flex-shrink-0">
                Default
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

          {/* Preview of selected-but-not-yet-saved client */}
          {activeClient && activeClient.id !== defaultClientId && (
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
          disabled={saving || loadingClients || !selectedId}
          className="w-full gap-2"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
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

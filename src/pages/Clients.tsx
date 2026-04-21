import { useEffect, useState, useMemo } from "react";
import { Loader2, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useFetchInvoicesWithTotals } from "@/api/invoice.api";
import { useFetchClients, useArchiveClient } from "@/api/client.api";
import { FeaturedClientCard } from "@/components/clients/FeaturedClientCard";
import { StandardClientCard } from "@/components/clients/StandardClientCard";
import { EditClientModal } from "@/components/clients/EditClientModal";
import { usePlanLimits } from "@/hooks/usePlanLimits";
import type { Client } from "@/types/client.types";

export function Clients() {
  const { tier, activeClientCount, limits } = usePlanLimits();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  const archiveMutation = useArchiveClient();

  const handleArchive = async (id: string, isArchived: boolean) => {
    try {
      await archiveMutation.mutateAsync({ clientId: id, isArchived });
      toast.success(
        isArchived
          ? "Client archived successfully"
          : "Client restored successfully",
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to update client status");
    }
  };

  const handleEdit = (client: any) => {
    setEditingClient(client as Client);
    setIsEditModalOpen(true);
  };

  const {
    data: clients,
    isLoading: loadingClients,
    isError: errorClients,
  } = useFetchClients();
  const {
    data: invoices,
    isLoading: loadingInvoices,
    isError: errorInvoices,
  } = useFetchInvoicesWithTotals();

  const isLoading = loadingClients || loadingInvoices;
  const isError = errorClients || errorInvoices;

  // Aggregation
  const { totalRevenue, enhancedClients } = useMemo(() => {
    let total = 0;

    const clientMap = new Map<
      string,
      { revenue: number; completedInvoices: number }
    >();
    (invoices || []).forEach((inv) => {
      if (inv.status === "paid") {
        total += inv.total_amount_owed || 0;
      }

      if (inv.client_id) {
        const stats = clientMap.get(inv.client_id) || {
          revenue: 0,
          completedInvoices: 0,
        };
        if (inv.status === "paid") {
          stats.revenue += inv.total_amount_owed || 0;
          stats.completedInvoices += 1;
        }
        clientMap.set(inv.client_id, stats);
      }
    });

    const mapped = (clients || []).map((c) => {
      const stats = clientMap.get(c.id) || { revenue: 0, completedInvoices: 0 };

      // Calculate dynamic status
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const clientInvoices = (invoices || []).filter(
        (inv) => inv.client_id === c.id,
      );
      const hasOutstanding = clientInvoices.some(
        (inv) => inv.status !== "paid",
      );
      const hasRecent = clientInvoices.some(
        (inv) => new Date(inv.created_at) >= thirtyDaysAgo,
      );

      let dynamicStatus: "ACTIVE" | "INACTIVE" | "VIP" | "ON HOLD" = "INACTIVE";
      if (stats.revenue >= 5000) {
        dynamicStatus = "VIP";
      } else if (hasOutstanding || hasRecent) {
        dynamicStatus = "ACTIVE";
      }

      return {
        ...c,
        name: c.company_name || c.contact_name || "Unknown Client",
        contactName: c.contact_name || "N/A",
        email: c.email || "No Email provided",
        revenue: stats.revenue,
        completedInvoices: stats.completedInvoices,
        industry: c.industry || "No Industry",
        status: dynamicStatus,
        is_archived: !!c.is_archived,
      };
    });

    // Sort by revenue descending
    mapped.sort((a, b) => b.revenue - a.revenue);

    return { totalRevenue: total, enhancedClients: mapped };
  }, [clients, invoices]);

  // Filtering
  const filtered = useMemo(() => {
    let result = enhancedClients;

    // Filter by archived status
    if (!showArchived) {
      result = result.filter((c) => !c.is_archived);
    }

    if (!searchQuery) return result;
    const q = searchQuery.toLowerCase();
    return result.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.industry && c.industry.toLowerCase().includes(q)) ||
        c.contactName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q),
    );
  }, [enhancedClients, searchQuery, showArchived]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse font-medium">
          Gathering your client data...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col h-full items-center justify-center min-h-[400px] gap-4">
        <div className="p-4 rounded-full bg-red-50 text-red-500">
          <Filter className="w-8 h-8 rotate-45" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-foreground mb-2">
            Something went wrong
          </h3>
          <p className="text-muted-foreground">
            We couldn't load your clients right now. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const featured = filtered[0];
  const standards = filtered.slice(1);

  return (
    <div className="flex flex-col gap-8 max-w-[1400px] w-full mx-auto relative pb-20">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pt-2">
        <div className="max-w-xl">
          <h1 className="text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Client
            <br />
            Directory
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Managing partnerships and high-value collaborations across your
            creative ecosystem.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="md:text-right pt-2 text-left">
            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-2">
              Total Partner Revenue
            </p>
            <p className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-primary to-violet-500">
              {totalRevenue.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              })}
            </p>
          </div>

          <div className="md:text-right pt-2 text-left border-l border-border pl-8">
            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-2">
              Active Slots
            </p>
            <p className="text-5xl font-bold text-foreground">
              {activeClientCount}
              <span className="text-xl text-muted-foreground font-medium ml-1">
                / {limits.activeClients === 999999 ? '∞' : limits.activeClients}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar Area */}
      <div className="flex gap-4">
        <div className="flex flex-1 max-w-2xl items-center bg-muted/40 hover:bg-muted/60 transition-colors rounded-2xl px-4 h-14 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-card">
          <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search brands, contacts, or industries..."
            className="border-0 bg-transparent shadow-none focus-visible:ring-0 text-base h-full w-full px-3"
          />
        </div>

        {/* TODO: Add functionality to filter clients */}
        <Button
          variant={showArchived ? "secondary" : "outline"}
          className="h-14 px-6 rounded-2xl border-slate-200 gap-2 font-semibold transition-all"
          onClick={() => setShowArchived(!showArchived)}
        >
          {showArchived ? "Hide Archived" : "Show Archived"}
        </Button>
      </div>

      {/* Grid Area */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          No clients match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featured && (
            <div className="md:col-span-2 lg:col-span-2">
              <FeaturedClientCard
                client={{
                  ...featured,
                  notes: featured.notes || [],
                  is_archived: !!featured.is_archived,
                }}
                onEdit={() => handleEdit(featured)}
              />
            </div>
          )}

          {standards.map((c) => (
            <div key={c.id}>
              <StandardClientCard
                client={{
                  ...c,
                  is_archived: !!c.is_archived,
                }}
                onEdit={() => handleEdit(c)}
              />
            </div>
          ))}
        </div>
      )}
      <EditClientModal
        client={editingClient}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onArchive={handleArchive}
      />
    </div>
  );
}

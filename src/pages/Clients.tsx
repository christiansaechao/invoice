import { useEffect, useState, useMemo } from "react";
import { Loader2, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useFetchInvoicesWithTotals } from "@/api/invoice.api";
import { useFetchClients } from "@/api/client.api";
import { FeaturedClientCard, type FeaturedClient } from "@/components/clients/FeaturedClientCard";
import { StandardClientCard, type StandardClient } from "@/components/clients/StandardClientCard";
import type { InvoicesWithTotals } from "@/types/invoice.types";

const MOCK_INDUSTRIES = ["Lifestyle & Apparel", "Beauty & Wellness", "Productivity Tech", "Adventure Travel", "Consumer Electronics", "Digital Media"];
const MOCK_STATUSES: ("ACTIVE" | "INACTIVE" | "VIP" | "ON HOLD")[] = ["ACTIVE", "ACTIVE", "VIP", "ON HOLD", "INACTIVE"];

export function Clients() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: clients, isLoading: loadingClients, isError: errorClients } = useFetchClients();
  const { data: invoices, isLoading: loadingInvoices, isError: errorInvoices } = useFetchInvoicesWithTotals();

  const isLoading = loadingClients || loadingInvoices;
  const isError = errorClients || errorInvoices;

  // Aggregation
  const { totalRevenue, enhancedClients } = useMemo(() => {
    let total = 0;

    const clientMap = new Map<string, { revenue: number; collabs: number }>();
    (invoices || []).forEach(inv => {
      if (inv.status === "paid") {
        total += inv.total_amount_owed || 0;
      }

      if (inv.client_id) {
        const stats = clientMap.get(inv.client_id) || { revenue: 0, collabs: 0 };
        stats.collabs += 1;
        if (inv.status === "paid") {
          stats.revenue += (inv.total_amount_owed || 0);
        }
        clientMap.set(inv.client_id, stats);
      }
    });

    const mapped = (clients || []).map((c, idx) => {
      const stats = clientMap.get(c.id) || { revenue: 0, collabs: 0 };
      return {
        id: c.id,
        name: c.company_name || c.contact_name || "Unknown Client",
        contactName: c.contact_name || "N/A",
        email: c.email || "No Email provided",
        revenue: stats.revenue,
        collabs: stats.collabs,
        industry: MOCK_INDUSTRIES[idx % MOCK_INDUSTRIES.length],
        status: MOCK_STATUSES[idx % MOCK_STATUSES.length],
      };
    });

    // Sort by revenue descending
    mapped.sort((a, b) => b.revenue - a.revenue);

    return { totalRevenue: total, enhancedClients: mapped };
  }, [clients, invoices]);

  // Filtering
  const filtered = useMemo(() => {
    if (!searchQuery) return enhancedClients;
    const q = searchQuery.toLowerCase();
    return enhancedClients.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.industry.toLowerCase().includes(q) ||
      c.contactName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  }, [enhancedClients, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-slate-500 animate-pulse font-medium">Gathering your client data...</p>
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
          <h3 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h3>
          <p className="text-slate-500">We couldn't load your clients right now. Please try again later.</p>
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
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Client<br />Directory
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed">
            Managing partnerships and high-value collaborations across your creative ecosystem.
          </p>
        </div>

        <div className="md:text-right pt-2 text-left">
          <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">Total Partner Revenue</p>
          <p className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-primary to-violet-500">
            {totalRevenue.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      {/* Toolbar Area */}
      <div className="flex gap-4">
        <div className="flex flex-1 max-w-2xl items-center bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl px-4 h-14 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-white">
          <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search brands, contacts, or industries..."
            className="border-0 bg-transparent shadow-none focus-visible:ring-0 text-base h-full w-full px-3"
          />
        </div>

        {/* TODO: Add functionality to filter clients */}
        {/* <Button variant="outline" className="h-14 px-6 rounded-2xl border-slate-200 bg-slate-50 hover:bg-slate-100 gap-2 font-semibold">
          <Filter className="w-4 h-4" /> Filter
        </Button> */}
      </div>

      {/* Grid Area */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center text-slate-500">No clients match your search.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featured && (
            <div className="md:col-span-2 lg:col-span-2">
              <FeaturedClientCard
                client={{
                  ...featured,
                  preferences: [
                    "Prefers raw, unedited BTS content for IG Stories.",
                    "30-day exclusive lock-out for tech hardware.",
                    "Net-15 payment terms (Reliable)."
                  ]
                }}
              />
            </div>
          )}

          {standards.map(c => (
            <div key={c.id}>
              <StandardClientCard client={c} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

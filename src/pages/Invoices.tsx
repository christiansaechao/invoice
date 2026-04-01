import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/invoice/Header";
import { EditInvoiceModal } from "@/components/invoice/EditInvoiceModal";
import type { InvoicesWithTotals } from "@/types/invoice.types";
import { LoaderCircle, Pencil } from "lucide-react";
import { fetchInvoicesWithTotals, updateInvoiceStatus } from "@/services/invoice.services";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Invoices() {
  const [invoices, setInvoices] = useState<InvoicesWithTotals[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [editingInvoice, setEditingInvoice] = useState<InvoicesWithTotals | null>(null);

  // Filter States
  const [filterId, setFilterId] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterClient, setFilterClient] = useState("");
  const [filterMinTotal, setFilterMinTotal] = useState("");
  const [filterMaxTotal, setFilterMaxTotal] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        const fetched = await fetchInvoicesWithTotals();
        if (cancelled) return;
        setInvoices(fetched || []);
      } catch (e) {
        if (!cancelled) console.error("Failed to load invoices", e);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshTrigger]);

  const toggleStatus = async (invoiceId: string, currentStatus: boolean) => {
    // Optimistic UI update
    setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, completed: !currentStatus } : inv));
    
    const { success } = await updateInvoiceStatus(invoiceId, !currentStatus);
    
    if (success) {
      toast.success(`Invoice marked as ${!currentStatus ? 'complete' : 'incomplete'}`);
    } else {
      toast.error("Failed to update status");
      // Revert optimistic update
      setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, completed: currentStatus } : inv));
    }
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      // 1. Invoice ID Match
      if (filterId && !String(inv.invoice_number).includes(filterId)) return false;

      // 2. Date Match
      const dateStr = new Date(inv.created_at).toLocaleDateString();
      if (filterDate && !dateStr.includes(filterDate)) return false;

      // 3. Client Match - Matches dynamic company name or contact from the view
      if (filterClient) {
        const query = filterClient.toLowerCase();
        const company = inv.client_company_name?.toLowerCase() || "";
        const contact = inv.client_contact_name?.toLowerCase() || "";
        if (!company.includes(query) && !contact.includes(query)) return false;
      }

      // 4. Totals Boundary logic
      if (filterMinTotal && inv.total_amount_owed < parseFloat(filterMinTotal)) return false;
      if (filterMaxTotal && inv.total_amount_owed > parseFloat(filterMaxTotal)) return false;

      // 5. Status Boolean Match
      if (filterStatus === "complete" && !inv.completed) return false;
      if (filterStatus === "incomplete" && inv.completed) return false;

      return true;
    });
  }, [invoices, filterId, filterDate, filterClient, filterMinTotal, filterMaxTotal, filterStatus]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-br from-white to-slate-50 border border-border p-6 rounded-xl shadow-sm">
        <Header />
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
          <Link
            to="/dashboard/invoices/new"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Create New Invoice
          </Link>
        </div>

        {/* Filter Bar Component */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 bg-white p-4 rounded-xl border border-border shadow-sm items-end">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Invoice ID</label>
            <Input placeholder="Search ID..." value={filterId} onChange={(e) => setFilterId(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Date</label>
            <Input placeholder="MM/DD/YYYY" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Client</label>
            <Input placeholder="Search client..." value={filterClient} onChange={(e) => setFilterClient(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Min Total</label>
            <Input type="number" placeholder="$0.00" value={filterMinTotal} onChange={(e) => setFilterMinTotal(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Max Total</label>
            <Input type="number" placeholder="$0.00" value={filterMaxTotal} onChange={(e) => setFilterMaxTotal(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="all">All</option>
              <option value="complete">Complete</option>
              <option value="incomplete">Incomplete</option>
            </select>
          </div>
        </div>

        {/* Dynamic Refactored Data Table */}
        <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-border">
              <tr>
                <th className="py-3 px-4 text-left font-semibold text-muted-foreground tracking-wide">Invoice ID</th>
                <th className="py-3 px-4 text-left font-semibold text-muted-foreground tracking-wide">Date</th>
                <th className="py-3 px-4 text-left font-semibold text-muted-foreground tracking-wide">Client</th>
                <th className="py-3 px-4 text-right font-semibold text-muted-foreground tracking-wide">Total</th>
                <th className="py-3 px-4 text-center font-semibold text-muted-foreground tracking-wide">Status</th>
                <th className="py-3 px-4 text-center font-semibold text-muted-foreground tracking-wide w-[60px]"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <LoaderCircle className="w-8 h-8 animate-spin text-muted-foreground mx-auto" />
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    No invoices match your filters.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-border/50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-medium">{inv.invoice_number}</td>
                    <td className="py-3 px-4 text-muted-foreground tabular-nums">
                      {new Date(inv.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {inv.client_company_name ? (
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{inv.client_company_name}</span>
                          {inv.client_contact_name && <span className="text-xs">{inv.client_contact_name}</span>}
                        </div>
                      ) : (
                        <span className="italic opacity-50">Unknown Client</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums font-medium">
                      ${(inv.total_amount_owed || 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleStatus(inv.id, inv.completed)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase transition-colors hover:opacity-80 cursor-pointer ${
                          inv.completed
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        {inv.completed ? "Complete" : "Incomplete"}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button 
                        onClick={() => setEditingInvoice(inv)}
                        title="Edit Invoice"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-slate-200 transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EditInvoiceModal 
        isOpen={!!editingInvoice} 
        onClose={() => setEditingInvoice(null)} 
        invoice={editingInvoice}
        onSaveSuccess={() => setRefreshTrigger(t => t + 1)}
      />
    </div>
  );
}

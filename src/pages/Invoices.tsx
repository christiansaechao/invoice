import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { EditInvoiceModal } from "@/components/invoice/EditInvoiceModal";
import { InvoiceRichList } from "@/components/invoice/InvoiceRichList/InvoiceRichList";
import type { InvoicesWithTotals } from "@/types/invoice.types";
import { useFetchInvoicesWithTotals } from "@/api/invoice.api";
import { Input } from "@/components/ui/input";

export default function Invoices() {
  const {
    data: invoicesData,
    isLoading,
  } = useFetchInvoicesWithTotals();
  const invoices = (invoicesData as InvoicesWithTotals[]) || [];

  const [editingInvoice, setEditingInvoice] =
    useState<InvoicesWithTotals | null>(null);

  // Filter States
  const [filterId, setFilterId] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterClient, setFilterClient] = useState("");
  const [filterMinTotal, setFilterMinTotal] = useState("");
  const [filterMaxTotal, setFilterMaxTotal] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      // 1. Invoice ID Match
      if (filterId && !String(inv.invoice_number).includes(filterId))
        return false;

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
      if (filterMinTotal && inv.total_amount_owed < parseFloat(filterMinTotal))
        return false;
      if (filterMaxTotal && inv.total_amount_owed > parseFloat(filterMaxTotal))
        return false;

      // 5. Status Enum Match
      if (filterStatus !== "all" && inv.status !== filterStatus) return false;

      return true;
    });
  }, [
    invoices,
    filterId,
    filterDate,
    filterClient,
    filterMinTotal,
    filterMaxTotal,
    filterStatus,
  ]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto px-4 py-8">
      {/* <div className="bg-gradient-to-br from-white to-slate-50 border border-border p-6 rounded-xl shadow-sm">
        <Header />
      </div> */}

      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
          <Link
            to="/dashboard/invoices"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Create New Invoice
          </Link>
        </div>

        {/* Filter Bar Component */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 bg-card p-4 rounded-xl border border-border shadow-sm items-end">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Invoice ID
            </label>
            <Input
              placeholder="Search ID..."
              value={filterId}
              onChange={(e) => setFilterId(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Date
            </label>
            <Input
              placeholder="MM/DD/YYYY"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Client
            </label>
            <Input
              placeholder="Search client..."
              value={filterClient}
              onChange={(e) => setFilterClient(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Min Total
            </label>
            <Input
              type="number"
              placeholder="$0.00"
              value={filterMinTotal}
              onChange={(e) => setFilterMinTotal(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Max Total
            </label>
            <Input
              type="number"
              placeholder="$0.00"
              value={filterMaxTotal}
              onChange={(e) => setFilterMaxTotal(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="all">All</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>

        <InvoiceRichList
          invoices={filteredInvoices}
          isLoading={isLoading}
          onEdit={setEditingInvoice}
        />
      </div>

      <EditInvoiceModal
        isOpen={!!editingInvoice}
        onClose={() => setEditingInvoice(null)}
        invoice={editingInvoice}
      />
    </div>
  );
}

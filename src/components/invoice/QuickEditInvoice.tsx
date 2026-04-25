import { useState, useEffect, useMemo, useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { LineItemsForm } from "./LineItemsForm";
import { useLineItems } from "@/hooks/useLineItems";
import {
  useFetchEntriesByInvoiceId,
  useUpdateInvoiceEntries,
} from "@/api/invoice.api";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { InvoicesWithTotals } from "@/types/invoice.types";

export function QuickEditInvoice({
  invoices,
}: {
  invoices: InvoicesWithTotals[];
}) {
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>("");
  const updateInvoiceEntriesMutation = useUpdateInvoiceEntries();

  const {
    rows,
    setRows,
    hourlyRate,
    setHourlyRate,
    updateRow,
    addRow,
    removeRow,
  } = useLineItems([]);

  // 1. Group Companies
  const uniqueCompanies = useMemo(() => {
    const names = invoices
      .map((i) => i.client_company_name)
      .filter(Boolean) as string[];
    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
  }, [invoices]);

  // 2. Initial Loader Set
  useEffect(() => {
    if (!selectedCompany && invoices.length > 0) {
      const topInvoice = [...invoices]
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
        .reverse()[0];
      if (topInvoice.client_company_name) {
        setSelectedCompany(topInvoice.client_company_name);
        setSelectedInvoiceId(topInvoice.id);
      }
    }
  }, [invoices, selectedCompany]);

  // 3. Filter dropdown of invoices relative explicitly to active Company Parent selected
  const filteredInvoices = useMemo(() => {
    if (!selectedCompany) return invoices;
    return invoices.filter(
      (inv) => inv.client_company_name === selectedCompany,
    );
  }, [invoices, selectedCompany]);

  // Set the first available matching filtered invoice cleanly resolving cascading
  useEffect(() => {
    if (selectedCompany && filteredInvoices.length > 0) {
      setSelectedInvoiceId((prev) => {
        const stillExists = filteredInvoices.find((inv: any) => inv.id === prev);
        return stillExists ? prev : filteredInvoices[0].id;
      });
    } else {
      setSelectedInvoiceId("");
    }
  }, [selectedCompany, filteredInvoices]);

  const activeInvoice =
    invoices.find((inv) => inv.id === selectedInvoiceId) || null;

  const { data: entriesData, isLoading } = useFetchEntriesByInvoiceId(
    activeInvoice?.id || ""
  );

  // Stabilize entries reference — only update when the data content actually changes
  const prevEntriesRef = useRef<string>("");
  useEffect(() => {
    const serialized = JSON.stringify(entriesData ?? []);
    if (serialized === prevEntriesRef.current) return;
    prevEntriesRef.current = serialized;

    const entries = entriesData ?? [];
    const sortedEntries = [...entries].sort(
      (a: any, b: any) =>
        new Date(b.work_date).getTime() - new Date(a.work_date).getTime(),
    );
    setRows(sortedEntries.length > 0 ? sortedEntries : []);
  }, [entriesData, setRows]);

  const handleSave = async () => {
    if (!activeInvoice) return;

    // Sleep 1 tick to flush calculation state
    setTimeout(async () => {
      try {
        await updateInvoiceEntriesMutation.mutateAsync({
          invoiceId: activeInvoice.id,
          rows,
        });
        toast.success("Invoice entries updated successfully!");
      } catch (error: any) {
        toast.error(error.message || "Failed to update entries.");
      }
    }, 50);
  };

  const isSaving = updateInvoiceEntriesMutation.isPending;

  if (!invoices || invoices.length === 0) {
    return (
      <Card className="h-full bg-muted/20">
        <CardHeader>
          <CardTitle className="text-lg">Quick Edit</CardTitle>
          <CardDescription>
            Instantly append items to your records.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12 text-muted-foreground text-sm border-t border-border">
          No invoices available to edit.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col bg-muted/20 shadow-sm overflow-hidden">
      <CardHeader className="pb-4 bg-card border-b border-border">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between min-w-0">
            <div>
              <CardTitle className="text-lg">Quick Edit</CardTitle>
              <CardDescription className="mt-1">
                Append line items instantly.
              </CardDescription>
            </div>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isLoading || isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap min-w-[70px]">
                Company:
              </span>
              <select
                className="flex h-8 w-full max-w-[240px] items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
              >
                <option value="" disabled>
                  Select a Company
                </option>
                {uniqueCompanies.map((name: any) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap min-w-[70px]">
                Invoice:
              </span>
              <select
                className="flex h-8 w-full max-w-[240px] items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted"
                value={selectedInvoiceId}
                onChange={(e) => setSelectedInvoiceId(e.target.value)}
                disabled={!selectedCompany || filteredInvoices.length === 0}
              >
                {filteredInvoices.length === 0 ? (
                  <option value="" disabled>
                    No invoices found
                  </option>
                ) : (
                  filteredInvoices.map((inv: any) => (
                    <option key={inv.id} value={inv.id}>
                      #{inv.invoice_number}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-0">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="p-4 [&>div]:pt-0 [&>div]:border-0 bg-card">
            <LineItemsForm
              rows={rows}
              hourlyRate={hourlyRate}
              setHourlyRate={setHourlyRate}
              updateRow={updateRow}
              removeRow={removeRow}
              addRow={addRow}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

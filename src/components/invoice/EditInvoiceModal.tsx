import { useState, useMemo, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { InvoiceDetailsForm } from "./InvoiceDetailsForm";
import { LineItemsForm } from "./LineItemsForm";
import { Button } from "@/components/ui/button";
import { Save, Loader2, Printer, Lock, Send } from "lucide-react";
import { useFetchClients } from "@/api/client.api";
import {
  useFetchEntriesByInvoiceId,
  useUpdateFullInvoice,
} from "@/api/invoice.api";
import { useFetchInvoiceBalance } from "@/api/payment.api";
import { toast } from "sonner";
import { getBillToOverride, createEmptyRow } from "@/utils/invoice.utils";
import { computeTotalsFromRows, isFinancialChange } from "@/lib/billing";
import { sendInvoiceEmail } from "@/services/invoice.services";
import { useLineItems } from "@/hooks/useLineItems";
import type { InvoicesWithTotals } from "@/types/invoice.types";
import { TemplateRenderer } from "./TemplateRenderer";
import { useUser } from "@/store/user.store";
import { useInvoiceWorkspace } from "@/store/invoice.store";
import { buildInvoiceDocumentData } from "@/utils/invoice-document.utils";
import type { InvoiceTemplateSlug } from "@/types/invoice-document.types";
import { useTemplates } from "@/api/templates.api";

export function EditInvoiceModal({
  isOpen,
  onClose,
  invoice,
}: {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoicesWithTotals | null;
}) {
  // Generic states mapping the builder
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [date, setDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [templateId, setTemplateId] = useState("standard");
  const [currency, setCurrency] = useState("USD");
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const { profile } = useUser();
  const { data: templates } = useTemplates();
  const { data: clients = [] } = useFetchClients();
  const {
    discountMode,
    setDiscountMode,
    discountValue,
    setDiscountValue,
    taxRateBps,
    setTaxRateBps,
  } = useInvoiceWorkspace();

  const {
    rows,
    setRows,
    hourlyRate,
    setHourlyRate,
    updateRow,
    addRow,
    removeRow,
  } = useLineItems([]);

  const { data: fetchedEntries, isFetching: isFetchingEntries } =
    useFetchEntriesByInvoiceId(isOpen ? invoice?.id || "" : "");

  console.log(fetchedEntries);

  const { mutateAsync: updateFullInvoiceMutation, isPending: isDeploying } =
    useUpdateFullInvoice();

  const { data: balanceData } = useFetchInvoiceBalance(invoice?.id || "");

  // Initialization Hydrating Hooks

  useEffect(() => {
    if (isOpen && invoice) {
      setInvoiceNumber(String(invoice.invoice_number || ""));
      setSelectedClientId(invoice.client_id || "");
      const rawDate = invoice.invoice_date || invoice.created_at;
      setDate(rawDate ? rawDate.split("T")[0] : "");
      setDueDate(invoice.due_date || "");
      setCurrency(invoice.currency || "USD");
      setTemplateId(invoice.template_id || "standard");
      setDiscountMode((invoice.discount_type as "flat" | "percent") || "flat");
      const dVal = invoice.discount_value || 0;
      setDiscountValue(invoice.discount_type === "percent" ? dVal : dVal / 100);
      setTaxRateBps(invoice.tax_rate || 0);
    } else {
      // Flush form if closed
      setInvoiceNumber("");
      setSelectedClientId("");
      setDate("");
      setRows([createEmptyRow()]);
      setCurrency("USD");
      setTemplateId("standard");
      setDueDate("");
    }
  }, [isOpen, invoice, setRows]);

  // Sync React Query data into local state
  useEffect(() => {
    if (isOpen && invoice && fetchedEntries) {
      setRows(fetchedEntries.length > 0 ? fetchedEntries : [createEmptyRow()]);
    }
  }, [isOpen, invoice, fetchedEntries, setRows]);

  const selectedClient = clients.find((c) => c.id === selectedClientId);
  const billToOverride = getBillToOverride(selectedClient);

  // Lifecycle guard: paid and void invoices are immutable
  const isLocked = invoice?.status === "paid" || invoice?.status === "void";
  const isSentInvoice =
    invoice?.status === "pending" || invoice?.status === "overdue";

  // Snapshot of original invoice for change detection
  const originalSnapshot = useRef<Record<string, unknown>>({});
  useEffect(() => {
    if (isOpen && invoice) {
      originalSnapshot.current = {
        subtotal: invoice.subtotal,
        total_amount: invoice.total_amount,
        discount_type: invoice.discount_type,
        discount_value: invoice.discount_value,
        tax_rate: invoice.tax_rate,
        tax_amount: invoice.tax_amount,
        currency: invoice.currency,
        due_date: invoice.due_date,
      };
    }
  }, [isOpen, invoice]);

  const {
    subtotal,
    total,
    discountAmt,
    tax,
    subtotalCents,
    totalCents,
    discountCents,
    taxCents,
  } = useMemo(
    () => computeTotalsFromRows(rows, discountMode, discountValue, taxRateBps),
    [rows, discountMode, discountValue, taxRateBps],
  );

  // Detect if current edits include financial changes compared to original
  const hasFinancialChanges = useMemo(() => {
    if (!isSentInvoice) return false;
    const current: Record<string, unknown> = {
      subtotal: subtotalCents,
      total_amount: totalCents,
      discount_type: discountMode,
      discount_value:
        discountMode === "percent" ? discountValue : discountCents,
      tax_rate: taxRateBps,
      tax_amount: taxCents,
      currency,
      due_date: dueDate,
    };
    return isFinancialChange(originalSnapshot.current, current);
  }, [
    isSentInvoice,
    subtotalCents,
    totalCents,
    discountMode,
    discountValue,
    discountCents,
    taxRateBps,
    taxCents,
    currency,
    dueDate,
  ]);

  const handleClientCreated = (newClient: any) => {
    setSelectedClientId(newClient.id);
  };

  const handleSave = async () => {
    if (isLocked) {
      toast.error(`This invoice is ${invoice?.status} and cannot be edited.`);
      return;
    }
    if (!invoice || !selectedClientId) {
      toast.error("Please ensure a Client is selected.");
      return;
    }

    try {
      const res = await updateFullInvoiceMutation({
        invoiceId: invoice.id,
        clientId: selectedClientId,
        invoiceNumber,
        rows,
        invoiceDate: date,
        dueDate,
        invoiceDetails: {
          subtotal: subtotalCents,
          total_amount: totalCents,
          currency,
          template_id: templateId,
          discount_type: discountMode,
          discount_value:
            discountMode === "percent" ? discountValue : discountCents,
          tax_rate: taxRateBps,
          tax_amount: taxCents,
        },
      });

      if (res.success) {
        toast.success("Successfully updated invoice.");
        onClose();
      } else {
        toast.error(res.error || "Failed to update record.");
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to update record.");
    }
  };

  /** Save + resend email for pending/overdue invoices with financial changes */
  const handleSaveAndResend = async () => {
    if (!invoice || !selectedClientId || isLocked) return;

    const client = clients.find((c) => c.id === selectedClientId);
    if (!client?.email) {
      toast.error("Client has no email address on file.");
      return;
    }

    setIsSending(true);
    try {
      // 1. Save the invoice first
      const res = await updateFullInvoiceMutation({
        invoiceId: invoice.id,
        clientId: selectedClientId,
        invoiceNumber,
        rows,
        invoiceDate: date,
        dueDate,
        invoiceDetails: {
          subtotal: subtotalCents,
          total_amount: totalCents,
          currency,
          template_id: templateId,
          discount_type: discountMode,
          discount_value:
            discountMode === "percent" ? discountValue : discountCents,
          tax_rate: taxRateBps,
          tax_amount: taxCents,
          ...(invoice.status === "draft" ? { status: "pending" } as any : {}),
        },
      });

      if (!res.success) {
        toast.error(res.error || "Failed to update record.");
        setIsSending(false);
        return;
      }

      // 2. Resend the email
      const { session } = useUser.getState();
      if (!session?.access_token) {
        toast.error("Session expired. Please log in again.");
        setIsSending(false);
        return;
      }

      await sendInvoiceEmail(
        previewDocument,
        client.email,
        session.access_token,
      );

      toast.success("Invoice updated and resent to client.");
      onClose();
    } catch (e: any) {
      toast.error(e.message || "Failed to save and resend.");
    } finally {
      setIsSending(false);
    }
  };

  const printInvoice = () => {
    setTimeout(() => {
      window.print();
    }, 150);
  };

  // Resolve template UUID to slug for renderer
  const templateSlug = useMemo(() => {
    if (!templates || !templateId) return "standard";
    const t = templates.find((t: any) => t.id === templateId);
    return t?.slug || "standard";
  }, [templates, templateId]);

  const previewDocument = useMemo(
    () =>
      buildInvoiceDocumentData({
        invoiceId: invoice?.id ?? "edit-preview",
        invoiceNumber,
        invoiceDate: date,
        dueDate,
        templateSlug: templateSlug as InvoiceTemplateSlug,
        rows,
        subtotal,
        total,
        discountAmt,
        taxAmt: tax,
        paid: (balanceData?.totalPaidCents ?? 0) / 100,
        balanceDue: (balanceData?.balanceDueCents ?? 0) / 100,
        fromProfile: profile,
        billTo: billToOverride,
      }),
    [
      invoice?.id,
      invoiceNumber,
      date,
      dueDate,
      templateSlug,
      rows,
      subtotal,
      total,
      discountAmt,
      tax,
      profile,
      billToOverride,
    ],
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 overflow-y-auto bg-background/95 backdrop-blur-md flex flex-col xl:flex-row shadow-2xl border-border/40">
        {/* Hidden screen readers elements preventing standard shadcn accessibility warning bounds */}
        <DialogTitle className="sr-only">Edit Invoice</DialogTitle>
        <DialogDescription className="sr-only">
          Editor module for updating an invoice record.
        </DialogDescription>

        {/* Left Side: Real Forms */}
        <div className="w-full xl:w-[480px] bg-card border-r border-border flex flex-col h-full flex-shrink-0 relative">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30 sticky top-0 z-10 backdrop-blur-sm">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Editing Invoice{" "}
                <span className="text-muted-foreground font-mono font-medium">
                  #{invoice?.invoice_number}
                </span>
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={printInvoice}
                title="Print Invoice / Save PDF"
                className="h-8 w-8"
              >
                <Printer className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={
                  isDeploying ||
                  isSending ||
                  isFetchingEntries ||
                  !invoice ||
                  isLocked
                }
                variant={hasFinancialChanges ? "outline" : "default"}
                className="h-8"
              >
                {isDeploying && !isSending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save
              </Button>
              {hasFinancialChanges && (
                <Button
                  size="sm"
                  onClick={handleSaveAndResend}
                  disabled={
                    isDeploying || isSending || isFetchingEntries || !invoice
                  }
                  className="h-8"
                >
                  {isSending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Save & Resend
                </Button>
              )}
            </div>
          </div>

          {isLocked && (
            <div className="mx-6 mt-4 px-4 py-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                This invoice is{" "}
                <span className="font-bold">{invoice?.status}</span> and cannot
                be edited.
              </p>
            </div>
          )}

          <div className="p-6 flex flex-col gap-6 flex-1 overflow-y-auto">
            {isFetchingEntries ? (
              <div className="flex items-center justify-center flex-1">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-2 min-w-0 mb-6">
                  <label
                    htmlFor="template-select-edit"
                    className="text-[10px] font-bold uppercase tracking-widest text-slate-400"
                  >
                    Invoice Template
                  </label>
                  <select
                    id="template-select-edit"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 truncate"
                    value={templateId}
                    onChange={(e) => setTemplateId(e.target.value)}
                  >
                    <option value="" disabled>
                      Select a template
                    </option>
                    {templates?.map((t: any) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <InvoiceDetailsForm
                  clients={clients}
                  selectedClientId={selectedClientId}
                  setSelectedClientId={setSelectedClientId}
                  onClientCreated={handleClientCreated}
                  invoiceNumber={invoiceNumber}
                  currency={currency}
                  setCurrency={setCurrency}
                  dueDate={dueDate}
                  setDueDate={setDueDate}
                />
                <LineItemsForm
                  rows={rows}
                  hourlyRate={hourlyRate}
                  setHourlyRate={setHourlyRate}
                  updateRow={updateRow}
                  removeRow={removeRow}
                  addRow={addRow}
                />
              </>
            )}
          </div>
        </div>

        {/* Right Side: Print Document Display */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center items-start">
          <div
            id="print-area"
            className="light bg-white min-w-full lg:min-w-[700px] max-w-[850px] shadow-lg border border-border rounded-xl overflow-hidden pointer-events-none scale-100 lg:scale-[0.85] origin-top"
          >
            <TemplateRenderer document={previewDocument} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { useState, useMemo, useEffect } from "react";
import { InvoiceDetailsForm } from "../components/invoice/InvoiceDetailsForm";
import { NudgeControls } from "../components/invoice/NudgeControls";
import { LineItemsForm } from "../components/invoice/LineItemsForm";
import { InvoiceActionButtons } from "../components/invoice/InvoiceActionButtons";
import { sendInvoiceEmail } from "@/services/invoice.services";
import { toast } from "sonner";
import { useFetchClients } from "@/api/client.api";
import { useSaveInvoice } from "@/api/invoice.api";
import { useCurrentSubscription } from "@/api/subscription.api";
import {
  MAGIC_CREDIT_LIMITS,
  getDaysUntilReset,
  type SubscriptionTier,
} from "@/constants/pricing";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import { calculateTotals, getBillToOverride } from "@/utils/invoice.utils";
import { toSubUnits } from "@/lib/currency";
import { useLineItems } from "@/hooks/useLineItems";
import { useSettings } from "@/store/settings.store";
import { useUser } from "@/store/user.store";
import { usePlanLimits } from "@/hooks/usePlanLimits";
import { extractInvoiceWithAI } from "@/services/ai.services";
import { useFetchUserSettings } from "@/api/settings.api";
import { useTemplates } from "@/api/templates.api";
import { CreateInvoiceWorkspace } from "../components/invoice/CreateInvoiceWorkspace";
import { useInvoiceWorkspace } from "@/store/invoice.store";
import { TemplateRenderer } from "../components/invoice/TemplateRenderer";
import { buildInvoiceDocumentData } from "@/utils/invoice-document.utils";
import type { InvoiceTemplateSlug } from "@/types/invoice-document.types";

export function NewInvoice() {
  const { session, profile } = useUser();
  const { canCreateInvoice, monthlyInvoiceCount, limits } = usePlanLimits();

  // Meta State
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [date, setDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Client Selection State
  const { data: clients = [] } = useFetchClients();
  const [selectedClientId, setSelectedClientId] = useState<string>("");

  // Invoice Template Local State
  const [templateId, setTemplateId] = useState<string>("");
  const [currency, setCurrency] = useState<string>("USD");

  // AI Feature State
  const [promptText, setPromptText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [credits, setCredits] = useState<number>(0); // NEW: Track credits locally
  const [tierLimit, setTierLimit] = useState<number>(
    MAGIC_CREDIT_LIMITS.starter,
  );
  const [daysUntilReset, setDaysUntilReset] = useState<number>(0);
  const [isSending, setIsSending] = useState(false);

  const { data: subscription, refetch: refetchSubscription } = useCurrentSubscription();

  // NEW: Fetch user's credits on mount
  useEffect(() => {
    if (!session?.user?.id) return;

    if (subscription && typeof subscription.magic_credits === "number") {
      setCredits(subscription.magic_credits || 0);
      setTierLimit(
        MAGIC_CREDIT_LIMITS[subscription.tier as SubscriptionTier] ??
          MAGIC_CREDIT_LIMITS.starter,
      );
      setDaysUntilReset(getDaysUntilReset(subscription.credits_last_reset));
    }
  }, [session?.user?.id, subscription]);

  const { data: userSettings } = useFetchUserSettings();
  const { defaultTemplateId, setDefaultTemplateId } = useSettings();
  // Fetch the full templates list so we can resolve UUID → slug for the renderer
  const { data: templates } = useTemplates();

  useEffect(() => {
    if (userSettings) {
      if (userSettings.default_client_id && !selectedClientId) {
        setSelectedClientId(userSettings.default_client_id);
      }
      if (userSettings.default_template_id) {
        setDefaultTemplateId(userSettings.default_template_id);
        // Always keep local templateId in sync when the global default changes
        // (only override if the user hasn't manually picked a different one for this invoice)
        setTemplateId((prev) =>
          prev === "" ? (userSettings.default_template_id || "") : prev,
        );
      }
    }
  }, [userSettings, selectedClientId, setDefaultTemplateId]);

  // Resolve the active template UUID to its slug for the renderer
  const activeTemplateSlug =
    (templates as any[])?.find(
      (t) => t.id === (templateId || defaultTemplateId),
    )?.slug ?? "standard";

  // Synchronize Payment Terms offset into Due Date automatically
  const { paymentTerms, workspaceMode, nudgeConfig, documentType, discountMode, discountValue } =
    useInvoiceWorkspace();

  useEffect(() => {
    if (workspaceMode === "recurring") {
      setDueDate(""); // Recurring hides standard explicit due-date math
      return;
    }

    if (!date) {
      setDueDate("");
      return;
    }

    const d = new Date(date);
    if (paymentTerms === "net-15") d.setUTCDate(d.getUTCDate() + 15);
    if (paymentTerms === "net-30") d.setUTCDate(d.getUTCDate() + 30);
    if (paymentTerms === "net-60") d.setUTCDate(d.getUTCDate() + 60);

    setDueDate(d.toISOString().split("T")[0]);
  }, [date, paymentTerms, workspaceMode]);

  async function handleAIExtraction() {
    if (!promptText.trim() || credits <= 0 || !session?.user?.id) return;
    setIsExtracting(true);

    try {
      // PASS DATA HERE: We send prompt, user ID, current clients list, and current rate
      const response = await extractInvoiceWithAI(
        promptText,
        session.user.id,
        clients,
        hourlyRate,
      );

      const extractedData = response.result ?? response;

      console.log("AI Extraction Complete:", extractedData);

      // 2. Populate Form State
      if (extractedData.client_id) {
        setSelectedClientId(extractedData.client_id);
      }

      setDate(extractedData.invoice_date);
      setDueDate(extractedData.due_date);
      setHourlyRate(String(extractedData.hourly_rate));

      // Update the table rows
      setRows(extractedData.entries);

      // 3. UI Updates: use server-provided remaining credits when available
      if (typeof response.creditsRemaining === "number") {
        setCredits(response.creditsRemaining);
      } else {
        // Fallback: refetch subscription credits
        try {
          const { data: refreshedSub } = await refetchSubscription();
          if (refreshedSub && typeof refreshedSub.magic_credits === "number") {
            setCredits(refreshedSub.magic_credits || 0);
            setTierLimit(
              MAGIC_CREDIT_LIMITS[refreshedSub.tier as SubscriptionTier] ??
                MAGIC_CREDIT_LIMITS.starter,
            );
            setDaysUntilReset(
              getDaysUntilReset(refreshedSub.credits_last_reset),
            );
          }
        } catch (e) {
          console.error("Failed to refresh subscription credits:", e);
        }
      }

      toast.success("Invoice generated successfully!");
      setPromptText(""); // Clear the prompt after success
    } catch (error) {
      console.error("Error with AI extraction:", error);
      toast.error(
        String(
          (error as Error).message || "Failed to generate invoice with AI.",
        ),
      );
    } finally {
      setIsExtracting(false);
    }
  }

  const saveInvoiceMutation = useSaveInvoice();

  const selectedClient = clients.find((c) => c.id === selectedClientId);
  const billToOverride = getBillToOverride(selectedClient);

  const handleClientCreated = (newClient: any) => {
    setSelectedClientId(newClient.id);
  };

  const {
    rows,
    hourlyRate,
    setRows,
    setHourlyRate,
    updateRow,
    addRow,
    removeRow,
  } = useLineItems();

  const saveNewInvoice = async () => {
    if (!selectedClientId) {
      toast("Please select a client before saving the invoice.");
      return;
    }
    const result = await saveInvoiceMutation.mutateAsync({
      rows,
      clientId: selectedClientId,
      invoiceDate: date,
      dueDate,
      invoiceDetails: {
        subtotal: toSubUnits(subtotal),
        total_amount: toSubUnits(total),
        currency: currency,
        discount_type: discountMode,
        discount_value: discountMode === "percent" ? discountValue : toSubUnits(discountValue),
        tax_amount: 0,
        template_id: templateId,
        auto_nudge: nudgeConfig.enabled,
        nudge_profile: nudgeConfig.profile,
        work_week_only: nudgeConfig.workWeekOnly,
        doc_type: documentType,
      },
    });

    toast(result.message);

    // Update the preview with the server-assigned invoice number
    if (result.success && result.invoice?.invoice_number) {
      setInvoiceNumber(String(result.invoice.invoice_number));
      return result.invoice; // Return the saved invoice data
    }
    return null;
  };

  const handleSendToClient = async () => {
    if (!selectedClientId) {
      toast.error("Please select a client first.");
      return;
    }

    const client = clients.find((c) => c.id === selectedClientId);
    if (!client?.email) {
      toast.error("This client doesn't have an email address. Please add one first.");
      return;
    }

    setIsSending(true);
    try {
      // 1. Ensure invoice is saved
      let savedInvoice = null;
      if (!invoiceNumber) {
        toast("Saving invoice before sending...");
        savedInvoice = await saveNewInvoice();
        if (!savedInvoice) throw new Error("Failed to save invoice");
      }

      // 2. Dispatch email
      const accessToken = session?.access_token;
      if (!accessToken) throw new Error("Authentication error");

      // We use the same data shape as the renderer
      await sendInvoiceEmail(previewDocument, client.email, accessToken);
      toast.success("Invoice sent to " + client.email);
    } catch (err: any) {
      console.error("Failed to send invoice", err);
      toast.error(err.message || "Failed to send invoice");
    } finally {
      setIsSending(false);
    }
  };

  const printInvoice = () => {
    setTimeout(() => {
      window.print();
    }, 150);
  };

  // Computed Totals
  const { subtotal, total, discountAmt } = useMemo(() => calculateTotals(rows, discountMode, discountValue), [rows, discountMode, discountValue]);
  const previewDocument = useMemo(
    () =>
      buildInvoiceDocumentData({
        invoiceId: "draft",
        invoiceNumber,
        invoiceDate: date,
        dueDate,
        templateSlug: activeTemplateSlug as InvoiceTemplateSlug,
        rows,
        subtotal,
        total,
        discountAmt,
        fromProfile: profile,
        billTo: billToOverride,
      }),
    [
      invoiceNumber,
      date,
      dueDate,
      activeTemplateSlug,
      rows,
      subtotal,
      total,
      discountAmt,
      profile,
      billToOverride,
    ],
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Global Fixed Action Bar — Bottom */}
      <div className="fixed bottom-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border px-4 md:px-8 py-3 flex justify-end items-center gap-6 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] no-print transition-all duration-400 left-[var(--sidebar-width,0px)]">
        {!canCreateInvoice && (
          <div className="text-right">
            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Monthly Limit Reached</p>
            <p className="text-xs text-muted-foreground">{monthlyInvoiceCount} / {limits.monthlyInvoices} invoices created this month</p>
          </div>
        )}
        <InvoiceActionButtons
          saveNewInvoice={saveNewInvoice}
          printInvoice={printInvoice}
          onSend={handleSendToClient}
          isSending={isSending}
          disabled={!canCreateInvoice}
        />
      </div>

      <div className="flex flex-col gap-10 px-4 md:px-8 max-w-[1600px] mx-auto w-full py-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 no-print mb-4">
          {/* B. Document Setup (Workspace + Template) */}
          <div className="flex flex-col gap-6">
            <CreateInvoiceWorkspace date={date} setDate={setDate} />
            <div className="flex flex-col gap-2 min-w-0 pt-6">
              <label
                htmlFor="template-select"
                className="text-[10px] font-bold uppercase tracking-widest text-slate-400"
              >
                Invoice Template
              </label>
              <select
                id="template-select"
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
          </div>

          <div className="flex flex-col gap-10">
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
          </div>
          <div className="flex flex-col gap-8">
            {/* E. Add-ons (NudgeControls) */}
            <NudgeControls amount={total} invoiceNumber={invoiceNumber} />

            {/* A. Magic AI Extraction */}
            <Accordion
              type="single"
              collapsible
              className="w-full border-y border-slate-100 no-print"
            >
              <AccordionItem value="ai" className="border-none">
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Start with Magic AI ⚡️
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-3 pb-4">
                    <textarea
                      className="w-full text-sm p-3 border border-border rounded-md resize-none h-24 focus:ring-2 focus:ring-primary outline-none bg-slate-50/50"
                      placeholder="e.g. Bill Song's Company for the server setup. 4 hours on April 1st. Use my standard rate."
                      value={promptText}
                      onChange={(e) => setPromptText(e.target.value)}
                      disabled={isExtracting || credits <= 0}
                    />
                    <div className="flex justify-between flex-col items-center gap-4">
                      <span
                        className={`text-xs ${credits < 5 ? "text-amber-500 font-medium" : "text-muted-foreground"}`}
                      >
                        ⚡️ {credits} / {tierLimit} magic generations remaining
                        (Resets in {daysUntilReset} days)
                      </span>
                      <button
                        onClick={handleAIExtraction}
                        disabled={
                          isExtracting || !promptText.trim() || credits <= 0
                        }
                        className="bg-primary text-primary-foreground py-2 px-4 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-colors"
                      >
                        {isExtracting
                          ? "Extracting..."
                          : credits <= 0
                            ? "Out of Credits"
                            : "Generate with AI"}
                      </button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <hr className="border-slate-100 mb-4 no-print" />

        <div className="flex flex-col xl:flex-row gap-16 items-start h-full pb-4">
          {/* Left Panel: Form (The Inspector) */}
          <div className="w-full xl:w-[480px] flex-shrink-0 flex flex-col gap-16 no-print">
            {/* D. Line Items (Reactive) */}
            <div className="">
              <LineItemsForm
                rows={rows}
                hourlyRate={hourlyRate}
                setHourlyRate={setHourlyRate}
                updateRow={updateRow}
                removeRow={removeRow}
                addRow={addRow}
              />
            </div>
          </div>

          {/* Right Panel: Pinned Preview */}
          <div className="flex-1 w-full flex justify-center sticky top-20 pb-12 print:static print:pb-0 print:top-0">
            <div
              id="print-area"
              className="aspect-[8.5/11] min-w-[700px] w-full max-w-[850px] h-max rounded-xl overflow-hidden backdrop-blur-md bg-white/70 border border-white/50 shadow-xl print:shadow-none print:border-none print:bg-white print:aspect-auto"
            >
              <TemplateRenderer document={previewDocument} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

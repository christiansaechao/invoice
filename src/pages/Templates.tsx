import { useSettings } from "@/store/settings.store";
import { toast } from "sonner";
import { Palette, Loader2, Star, ZoomIn } from "lucide-react";
import { useFetchUserSettings } from "@/api/settings.api";
import { useTemplates, useUpdateDefaultTemplate } from "@/api/templates.api";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/utils/utils";
import { TemplateRenderer } from "@/components/invoice/TemplateRenderer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { InvoiceDocumentData, InvoiceTemplateSlug } from "@/types/invoice-document.types";

// Dummy data so the preview always has something representative to show
const PREVIEW_DOCUMENT: InvoiceDocumentData = {
  invoiceId: "template-preview",
  invoiceNumber: "001",
  invoiceDate: new Date().toISOString().split("T")[0],
  dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
  templateSlug: "standard",
  from: {
    name: "North Star Studio",
    addressLine1: "1450 Market Street",
    addressLine2: "San Francisco, CA 94103",
    phone: "(415) 555-0148",
    email: "hello@northstar.studio",
  },
  billTo: {
    name: "Acme Corporation",
    secondary: "Jordan Ellis",
    addressLine1: "220 Mission Street",
    addressLine2: "San Francisco, CA 94105",
    phone: "(415) 555-0199",
  },
  lineItems: [
    { serviceDate: "2026-04-01", itemName: "Brand Strategy Session", description: "Full brand consultation", amount: 1200, quantity: 1, unitPrice: 1200 },
    { serviceDate: "2026-04-03", itemName: "Logo Design Package", description: "Primary + alternate marks", amount: 850, quantity: 1, unitPrice: 850 },
    { serviceDate: "2026-04-05", itemName: "Style Guide Delivery", description: "Typography, colors and usage guidance", amount: 450, quantity: 1, unitPrice: 450 },
  ],
  totals: {
    subtotal: 2500,
    total: 2500,
    currency: "USD",
  },
  notes: "Thank you for trusting us with your brand system.",
  terms: "Payment due within 14 days.",
};

export function Templates() {
  const { defaultTemplateId, setDefaultTemplateId } = useSettings();
  const { data: userSettings, isLoading: isSettingsLoading } = useFetchUserSettings();
  const { data: templates, isLoading: isTemplatesLoading } = useTemplates();
  const updateTemplateMutation = useUpdateDefaultTemplate();

  const [previewId, setPreviewId] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (userSettings?.default_template_id) {
      setDefaultTemplateId(userSettings.default_template_id);
      // Seed preview to current default on first load
      if (!previewId) setPreviewId(userSettings.default_template_id);
    }
  }, [userSettings, setDefaultTemplateId]);

  const handleSetDefault = async (tId: string, tName: string) => {
    setDefaultTemplateId(tId);
    try {
      await updateTemplateMutation.mutateAsync(tId);
      toast.success(`"${tName}" set as your default template`);
    } catch {
      toast.error("Failed to save template selection.");
    }
  };

  const isLoading = isSettingsLoading || isTemplatesLoading;
  const activePreviewSlug = templates?.find((t: any) => t.id === previewId)?.slug ?? previewId ?? "standard";
  const previewDocument = {
    ...PREVIEW_DOCUMENT,
    templateSlug: activePreviewSlug as InvoiceTemplateSlug,
  };

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Invoice Templates</h1>
        <p className="text-muted-foreground">Select the default appearance for all your new invoices.</p>
      </div>

      {/* Main split layout */}
      <div className="flex gap-6 items-start">

        {/* LEFT: Gallery */}
        <div className="flex-1 min-w-0 bg-card border border-border rounded-xl p-6 shadow-sm relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-xl z-20 backdrop-blur-[1px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
              <Palette className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Template Gallery</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Click a card to preview. Star to set as default.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {templates?.map((t: any) => {
              const isDefault = defaultTemplateId === t.id;
              const isPreviewing = previewId === t.id;
              return (
                <Card
                  key={t.id}
                  onClick={() => setPreviewId(t.id)}
                  className={cn(
                    "cursor-pointer transition-all duration-200 relative overflow-hidden group",
                    isPreviewing
                      ? "border-primary ring-2 ring-primary ring-offset-2 shadow-md"
                      : "hover:border-primary/40 hover:shadow-sm bg-white",
                    updateTemplateMutation.isPending ? "opacity-50 pointer-events-none" : ""
                  )}
                >
                  {/* Default star badge */}
                  {isDefault && (
                    <div className="absolute top-2 left-2 z-10 bg-amber-400 text-white p-1 rounded-full shadow">
                      <Star className="h-3 w-3 fill-white" />
                    </div>
                  )}

                  {/* Set as Default button — appears on hover or when previewing */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleSetDefault(t.id, t.name); }}
                    className={cn(
                      "absolute top-2 right-2 z-10 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full transition-all duration-200",
                      isDefault
                        ? "bg-primary text-white opacity-100"
                        : "bg-white/90 text-muted-foreground border border-border opacity-0 group-hover:opacity-100"
                    )}
                  >
                    {isDefault ? "Default" : "Set Default"}
                  </button>

                  {/* Thumbnail area */}
                  <div className={cn(
                    "h-36 border-b border-border flex items-center justify-center overflow-hidden transition-colors",
                    isPreviewing ? "bg-primary/5" : "bg-slate-50"
                  )}>
                    <Palette className={cn(
                      "h-10 w-10 transition-transform duration-300 group-hover:scale-110",
                      isPreviewing ? "text-primary" : "text-slate-200"
                    )} />
                  </div>

                  <CardHeader className="p-4">
                    <CardTitle className="text-sm font-semibold">{t.name}</CardTitle>
                    <CardDescription className="text-xs mt-0.5 line-clamp-2">{t.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          {(!templates || templates.length === 0) && !isLoading && (
            <div className="p-12 mt-4 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl">
              No templates available right now.
            </div>
          )}
        </div>

        {/* RIGHT: Preview Panel */}
        <div className="w-[320px] flex-shrink-0 sticky top-6">
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold tracking-tight">Live Preview</p>
              {previewId && (
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                  {templates?.find((t: any) => t.id === previewId)?.name ?? ""}
                </span>
              )}
            </div>

            {/* Scaled invoice preview — aspect ratio 8.5:11 */}
            <div className="w-full overflow-hidden rounded-lg border border-border shadow-inner bg-slate-100" style={{ aspectRatio: "8.5 / 11" }}>
              {previewId ? (
                <button
                  onClick={() => setModalOpen(true)}
                  className="relative w-full h-full block group/preview cursor-zoom-in"
                  title="Click to expand"
                >
                  <div
                    className="origin-top-left pointer-events-none"
                    style={{
                      width: "850px",
                      height: "1100px",
                      transform: `scale(${288 / 850})`,
                      transformOrigin: "top left",
                      background: "white",
                      overflow: "hidden",
                    }}
                  >
                    <TemplateRenderer document={previewDocument} />
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover/preview:bg-black/10 transition-colors duration-200 flex items-center justify-center rounded-lg">
                    <div className="opacity-0 group-hover/preview:opacity-100 transition-opacity duration-200 bg-black/60 text-white rounded-full p-2.5 shadow-lg">
                      <ZoomIn className="h-5 w-5" />
                    </div>
                  </div>
                </button>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <Palette className="h-8 w-8 text-slate-300" />
                  <p className="text-xs text-center px-4">Click a template card to see a live preview</p>
                </div>
              )}
            </div>

            {previewId && (
              <button
                onClick={() => {
                  const t = templates?.find((t: any) => t.id === previewId);
                  if (t) handleSetDefault(t.id, t.name);
                }}
                disabled={defaultTemplateId === previewId || updateTemplateMutation.isPending}
                className={cn(
                  "mt-3 w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-200",
                  defaultTemplateId === previewId
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-primary text-white hover:opacity-90 shadow-sm"
                )}
              >
                {defaultTemplateId === previewId ? "✓ Current Default" : "Set as Default"}
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Full-size template preview modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl w-full p-0 overflow-hidden border-border">
          <DialogHeader className="px-6 pt-5 pb-4 bg-white border-b border-border">
            <DialogTitle className="text-base font-semibold">
              {templates?.find((t: any) => t.id === previewId)?.name ?? "Template Preview"}
            </DialogTitle>
          </DialogHeader>

          {/* Container scrolls vertically. Inner uses scale() so no horizontal overflow. */}
          <div className="overflow-y-auto overflow-x-hidden bg-slate-100 p-6" style={{ maxHeight: "80vh" }}>
            {/* 
              The invoice is rendered at 850px then scaled to fit the dialog.
              A dialogs's usable inner width at max-w-4xl ≈ 832px (896 - 2*32px padding).
              Scale factor: 760 / 850 ≈ 0.894. We pick 760 to leave a little breathing room.
              transform-origin: top left + wrapper width = 850 * scale keeps layout clean.
            */}
            <div
              className="relative mx-auto"
              style={{
                width: "760px",
                height: `${Math.round(1100 * (760 / 850))}px`,
              }}
            >
              <div
                style={{
                  width: "850px",
                  transformOrigin: "top left",
                  transform: `scale(${760 / 850})`,
                  background: "white",
                  boxShadow: "0 4px 32px rgba(0,0,0,0.12)",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <TemplateRenderer document={previewDocument} />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}

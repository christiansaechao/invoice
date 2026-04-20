import { useInvoiceWorkspace } from "@/store/invoice.store";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/utils/utils";
import { useState, useEffect } from "react";
import { Loader2, Eye, Calendar, Clock } from "lucide-react";
import { useUser } from "@/store/user.store";

type NudgeControlsProps = {
  amount: number;
  invoiceNumber: string;
};

export function NudgeControls({ amount, invoiceNumber }: NudgeControlsProps) {
  const { nudgeConfig, setNudgeConfig } = useInvoiceWorkspace();
  const { session } = useUser();
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  const fetchPreview = async () => {
    if (!session?.access_token) return;
    setIsLoadingPreview(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/emailer/preview-nudge`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            profile: nudgeConfig.profile,
            milestone: 0, // Preview "Today" milestone by default
            amount: amount,
            invoiceNumber: invoiceNumber,
          }),
        },
      );
      if (response.ok) {
        const html = await response.text();
        setPreviewHtml(html);
      }
    } catch (err) {
      console.error("Failed to fetch nudge preview", err);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  useEffect(() => {
    if (isPreviewExpanded && nudgeConfig.enabled) {
      fetchPreview();
    }
  }, [isPreviewExpanded, nudgeConfig.profile, amount, invoiceNumber]);

  return (
    <div className="w-full flex flex-col gap-5 no-print">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Smart Reminders
        </h2>
        <Switch
          checked={nudgeConfig.enabled}
          onCheckedChange={(val) => setNudgeConfig({ enabled: val })}
        />
      </div>

      {nudgeConfig.enabled && (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">
              Tone Profile
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {(["chill", "professional", "direct"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setNudgeConfig({ profile: p })}
                  className={cn(
                    "py-2 px-3 text-xs font-semibold rounded-lg border transition-all capitalize",
                    nudgeConfig.profile === p
                      ? "bg-primary/10 border-primary text-primary shadow-sm"
                      : "bg-background border-border text-muted-foreground hover:border-slate-300",
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <Label
                htmlFor="skip-weekends"
                className="text-sm font-medium cursor-pointer"
              >
                Skip Weekends
              </Label>
            </div>
            <Switch
              id="skip-weekends"
              checked={nudgeConfig.workWeekOnly}
              onCheckedChange={(val) => setNudgeConfig({ workWeekOnly: val })}
            />
          </div>

          <div className="mt-2 text-[11px] text-muted-foreground leading-relaxed bg-blue-50/50 p-2.5 rounded-md border border-blue-100/50">
            ✨ Reminders will be sent <strong>3 days before</strong>,{" "}
            <strong>on the day</strong>, and <strong>3 & 7 days after</strong>{" "}
            the due date.
          </div>

          <button
            onClick={() => setIsPreviewExpanded(!isPreviewExpanded)}
            className="flex items-center justify-center gap-2 text-sm font-semibold text-primary py-2 hover:bg-primary/5 rounded-lg transition-colors border border-dashed border-primary/20"
          >
            {isLoadingPreview ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            {isPreviewExpanded ? "Hide Live Preview" : "View Live Preview"}
          </button>

          {isPreviewExpanded && (
            <div className="border border-border rounded-xl overflow-hidden shadow-inner bg-slate-100 p-4 animate-in zoom-in-95 duration-200">
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden min-h-[300px] flex items-center justify-center relative">
                {isLoadingPreview ? (
                  <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
                ) : previewHtml ? (
                  <iframe
                    srcDoc={previewHtml}
                    className="w-full h-[400px] border-none scale-[0.85] origin-top"
                    title="Nudge Preview"
                  />
                ) : (
                  <span className="text-xs text-muted-foreground">
                    Preview failed to load
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

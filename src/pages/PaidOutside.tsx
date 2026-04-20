import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Button as ShadButton } from "@/components/ui/button";
import { CheckCircle2, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function PaidOutside() {
  const [searchParams] = useSearchParams();
  const invoiceId = searchParams.get("id");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!invoiceId) return;
    setIsSubmitting(true);

    try {
      // Internal endpoint to notify about outside payment
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/invoices/${invoiceId}/paid-outside`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (response.ok) {
        setIsSubmitted(true);
        toast.success("Notification sent to the invoice creator.");
      } else {
        toast.error("Failed to send notification. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center animate-in zoom-in-95 duration-500">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2 font-serif">
            Thank You!
          </h1>
          <p className="text-slate-600 leading-relaxed">
            We've notified the sender that this invoice has been paid via
            another method. They will review and update the status shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2 font-serif">
            Invoice Paid?
          </h1>
          <p className="text-slate-600 leading-relaxed">
            If you've already settled this invoice through a bank transfer,
            cash, or another method, let the sender know so they can stop the
            reminders.
          </p>
        </div>

        <div className="space-y-4">
          <ShadButton
            onClick={handleSubmit}
            disabled={isSubmitting || !invoiceId}
            className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Send className="w-5 h-5 mr-2" />
            )}
            Notify Invoice Creator
          </ShadButton>

          <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
            Secure notification via Receipts
          </p>
        </div>
      </div>
    </div>
  );
}

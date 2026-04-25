import { CheckCircle2, CreditCard, FileSignature, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PublicStickyBarProps {
  docType: "invoice" | "quote";
  paymentStatus: string;
  totalAmount: number;
  currency: string;
  paymentLink: string | null;
  isConverting: boolean;
  isRestricted?: boolean;
  onPay: () => void;
  onConvert: () => void;
}

const formatCurrency = (amount: number, currency: string) =>
  amount.toLocaleString("en-US", { style: "currency", currency });

export function PublicStickyBar({
  docType,
  paymentStatus,
  totalAmount,
  currency,
  paymentLink,
  isConverting,
  isRestricted = false,
  onPay,
  onConvert,
}: PublicStickyBarProps) {
  const isPaid = paymentStatus === "paid";

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="bg-background/80 backdrop-blur-xl border-t border-border px-4 pt-3 pb-4 shadow-lg">
        {isPaid ? (
          /* ── Paid State ── */
          <div className="flex items-center justify-center gap-2.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="text-emerald-800 font-bold text-sm tracking-wide uppercase">
              Payment Received
            </span>
          </div>
        ) : (
          /* ── Actionable State ── */
          <div className="flex items-center justify-between gap-3">
            {/* Total */}
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
                Total Due
              </span>
              <span className="text-xl font-black tabular-nums text-foreground leading-tight">
                {formatCurrency(totalAmount, currency)}
              </span>
            </div>

            {/* CTA Button */}
            {docType === "quote" ? (
              <Button
                id="public-approve-quote-btn"
                onClick={onConvert}
                disabled={isConverting}
                size="lg"
                className="flex-shrink-0 h-12 px-5 bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-lg shadow-violet-200 rounded-xl gap-2"
              >
                {isConverting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FileSignature className="w-4 h-4" />
                )}
                {isConverting ? "Converting…" : "Approve & Convert"}
              </Button>
            ) : (
              !isRestricted && (
                <Button
                  id="public-pay-invoice-btn"
                  onClick={onPay}
                  disabled={!paymentLink}
                  size="lg"
                  className="flex-shrink-0 h-12 px-5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 rounded-xl gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  Pay Invoice
                </Button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

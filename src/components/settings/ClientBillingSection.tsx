import { useState, useEffect, useRef } from "react";
import { Zap, Loader2, CreditCard } from "lucide-react";
import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import { useFetchUserSettings, useUpdateUserSettings } from "@/api/settings.api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { PaymentMethods } from "@/types/invoice.types";

export function ClientBillingSection() {
  // Payment Methods Logic
  const { data: userSettings } = useFetchUserSettings();
  const updateSettings = useUpdateUserSettings();
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethods>({
    stripe: { enabled: true },
    paypal: { enabled: false },
    venmo: { enabled: false },
    bank: { enabled: false }
  });
  const [isSavingMethods, setIsSavingMethods] = useState(false);
  const paymentMethodsSyncRef = useRef(false);

  // Sync state if settings load after mounting
  useEffect(() => {
    if (userSettings?.payment_methods && !paymentMethodsSyncRef.current) {
      setPaymentMethods({
        stripe: userSettings.payment_methods.stripe ?? { enabled: true },
        paypal: userSettings.payment_methods.paypal ?? { enabled: false },
        venmo: userSettings.payment_methods.venmo ?? { enabled: false },
        bank: userSettings.payment_methods.bank ?? { enabled: false }
      });
      paymentMethodsSyncRef.current = true;
    }
  }, [userSettings?.payment_methods]);

  const handleSavePaymentMethods = async () => {
    if (paymentMethods.paypal.enabled && !paymentMethods.paypal.url?.trim()) {
      toast.error("Please enter a valid PayPal URL");
      return;
    }
    if (paymentMethods.venmo.enabled && !paymentMethods.venmo.username?.trim()) {
      toast.error("Please enter a Venmo username");
      return;
    }
    if (paymentMethods.bank.enabled && !paymentMethods.bank.instructions?.trim()) {
      toast.error("Please enter bank transfer instructions");
      return;
    }
    
    setIsSavingMethods(true);
    try {
      await updateSettings.mutateAsync({ payment_methods: paymentMethods });
      toast.success("Payment methods updated successfully");
    } catch (err) {
      toast.error("Failed to save payment methods");
    } finally {
      setIsSavingMethods(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
          <CreditCard className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight">Client Billing</h2>
          <p className="text-sm text-muted-foreground">Configure how clients can pay your invoices.</p>
        </div>
      </div>

      <div className="flex flex-col gap-6 bg-card border border-border rounded-xl p-6 shadow-sm mt-2">
        <div className="flex items-center justify-between gap-3 mb-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">Invoice Payment Methods</h3>
              <p className="text-sm text-muted-foreground">Enable or disable payment options for your invoices.</p>
            </div>
          </div>
          <Button 
            onClick={handleSavePaymentMethods}
            disabled={isSavingMethods}
            className="h-10 px-6 rounded-lg font-bold"
          >
            {isSavingMethods ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Methods"}
          </Button>
        </div>

        <div className="flex flex-col gap-5 border-t border-border pt-4">
          
          {/* Stripe Config */}
          <div className={cn("flex flex-col gap-3 p-4 rounded-xl transition-all", paymentMethods.stripe.enabled ? "bg-indigo-50/50 border border-indigo-100" : "bg-muted/30 border border-transparent")}>
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col">
                <Label className="text-base font-semibold flex items-center gap-2">Stripe <span className="px-2 py-0.5 rounded text-[10px] bg-primary/10 text-primary uppercase font-bold tracking-widest">Primary</span></Label>
                <span className="text-sm text-muted-foreground mt-0.5">Let clients pay invoices via credit cards and Apple Pay directly on the invoice.</span>
              </div>
              <Switch 
                checked={paymentMethods.stripe.enabled}
                onCheckedChange={(c) => setPaymentMethods(p => ({ ...p, stripe: { ...p.stripe, enabled: c }}))}
              />
            </div>
          </div>

          {/* PayPal Config */}
          <div className={cn("flex flex-col gap-3 p-4 rounded-xl border transition-all", paymentMethods.paypal.enabled ? "bg-card border-border shadow-sm" : "bg-muted/30 border-transparent")}>
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col">
                <Label className="text-base font-semibold flex items-center gap-2">PayPal</Label>
                <span className="text-sm text-muted-foreground mt-0.5">Offer PayPal as a secondary payment option.</span>
              </div>
              <Switch 
                checked={paymentMethods.paypal.enabled}
                onCheckedChange={(c) => setPaymentMethods(p => ({ ...p, paypal: { ...p.paypal, enabled: c }}))}
              />
            </div>
            {paymentMethods.paypal.enabled && (
              <div className="pt-2 animate-in fade-in slide-in-from-top-2">
                <Label className="text-xs mb-1.5 block text-muted-foreground">PayPal.me URL</Label>
                <Input 
                  placeholder="https://paypal.me/yourname"
                  value={paymentMethods.paypal.url || ""}
                  onChange={(e) => setPaymentMethods(p => ({ ...p, paypal: { ...p.paypal, url: e.target.value }}))}
                />
              </div>
            )}
          </div>

          {/* Venmo Config */}
          <div className={cn("flex flex-col gap-3 p-4 rounded-xl border transition-all", paymentMethods.venmo.enabled ? "bg-card border-border shadow-sm" : "bg-muted/30 border-transparent")}>
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col">
                <Label className="text-base font-semibold flex items-center gap-2">Venmo</Label>
                <span className="text-sm text-muted-foreground mt-0.5">Offer Venmo for quick mobile payments.</span>
              </div>
              <Switch 
                 checked={paymentMethods.venmo.enabled}
                 onCheckedChange={(c) => setPaymentMethods(p => ({ ...p, venmo: { ...p.venmo, enabled: c }}))}
              />
            </div>
            {paymentMethods.venmo.enabled && (
              <div className="pt-2 animate-in fade-in slide-in-from-top-2">
                <Label className="text-xs mb-1.5 block text-muted-foreground">Venmo Username</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">@</span>
                  <Input 
                    className="pl-8"
                    placeholder="your-username"
                    value={paymentMethods.venmo.username || ""}
                    onChange={(e) => setPaymentMethods(p => ({ ...p, venmo: { ...p.venmo, username: e.target.value }}))}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Bank Config */}
          <div className={cn("flex flex-col gap-3 p-4 rounded-xl border transition-all", paymentMethods.bank.enabled ? "bg-card border-border shadow-sm" : "bg-muted/30 border-transparent")}>
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col">
                <Label className="text-base font-semibold flex items-center gap-2">Bank Transfer (Wire / ACH)</Label>
                <span className="text-sm text-muted-foreground mt-0.5">Provide manual routing and account details to clients.</span>
              </div>
              <Switch 
                 checked={paymentMethods.bank.enabled}
                 onCheckedChange={(c) => setPaymentMethods(p => ({ ...p, bank: { ...p.bank, enabled: c }}))}
              />
            </div>
            {paymentMethods.bank.enabled && (
              <div className="pt-2 animate-in fade-in slide-in-from-top-2">
                <Label className="text-xs mb-1.5 block text-muted-foreground">Wire Instructions</Label>
                <Textarea 
                  placeholder="Bank Name: Chase&#10;Account: 123456789&#10;Routing: 987654321..."
                  rows={4}
                  value={paymentMethods.bank.instructions || ""}
                  onChange={(e) => setPaymentMethods(p => ({ ...p, bank: { ...p.bank, instructions: e.target.value }}))}
                />
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

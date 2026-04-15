import { useState, useEffect } from "react";
import { AlertCircle, ExternalLink, Loader2, Link, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useFetchUserSettings, useUpdateUserSettings } from "@/api/settings.api";

export function PaymentLinkSection() {
  const { data: userSettings, isLoading: loadingSettings } = useFetchUserSettings();
  const updatePaymentLinkMutation = useUpdateUserSettings();

  const [paymentLink, setPaymentLink] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");
  const [isDomainUncommon, setIsDomainUncommon] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Common payment domains that users typically use
  const commonDomains = ["paypal.com", "venmo.com", "stripe.com", "square.cash", "buy.stripe.com"];

  /**
   * Client-side validation for payment link
   */
  const validatePaymentLink = (url: string): boolean => {
    if (!url) {
      setValidationError("");
      setIsDomainUncommon(false);
      return true;
    }

    try {
      const parsed = new URL(url);

      // Check protocol
      if (!["http:", "https:"].includes(parsed.protocol)) {
        setValidationError("Must start with http:// or https://");
        return false;
      }

      // Check length
      if (url.length > 2048) {
        setValidationError("Payment link too long (max 2048 characters)");
        return false;
      }

      // Check if domain is uncommon (warning, not blocking)
      const hostname = parsed.hostname || "";
      const isCommon = commonDomains.some(d => hostname.includes(d));
      setIsDomainUncommon(!isCommon);

      setValidationError("");
      return true;
    } catch {
      setValidationError("Invalid URL format");
      return false;
    }
  };

  /**
   * Test link by opening in new tab
   */
  const handleTestLink = () => {
    if (paymentLink) {
      window.open(paymentLink, "_blank", "noopener,noreferrer");
    }
  };

  /**
   * Save payment link via mutation
   */
  const handleSave = async () => {
    if (!validatePaymentLink(paymentLink)) {
      return;
    }

    setIsSaving(true);
    try {
      await updatePaymentLinkMutation.mutateAsync({ payment_link: paymentLink || null });
      toast.success("Payment link saved!");
    } catch (error) {
      toast.error((error as any)?.message || "Failed to save payment link");
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Clear payment link
   */
  const handleClear = () => {
    setPaymentLink("");
    setValidationError("");
    setIsDomainUncommon(false);
  };

  /**
   * Load existing payment link from settings
   */
  useEffect(() => {
    if (userSettings?.payment_link) {
      setPaymentLink(userSettings.payment_link);
      validatePaymentLink(userSettings.payment_link);
    }
  }, [userSettings]);

  if (loadingSettings) {
    return (
      <div className="flex flex-col gap-6 bg-card border border-border p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 bg-card border border-border p-6 rounded-xl shadow-sm">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Link className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold tracking-tight">Primary Payment Link</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Clients will see a "Pay Now" button on invoices that links to this URL
        </p>
      </div>

      {/* Input field */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="payment-link" className="text-base font-semibold">
          Payment Link URL
        </Label>
        <div className="flex gap-2">
          <Input
            id="payment-link"
            type="url"
            placeholder="https://paypal.me/yourname"
            value={paymentLink}
            onChange={(e) => {
              setPaymentLink(e.target.value);
              validatePaymentLink(e.target.value);
            }}
            className={validationError && paymentLink ? "border-red-500 focus:ring-red-500" : ""}
          />
          {paymentLink && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground"
              title="Clear payment link"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Validation error */}
      {validationError && paymentLink && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{validationError}</p>
        </div>
      )}

      {/* Uncommon domain warning */}
      {isDomainUncommon && paymentLink && !validationError && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700">
            This looks like an uncommon payment domain. Make sure this is a legitimate payment link.
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleTestLink}
          disabled={!paymentLink || !!validationError}
          variant="outline"
          className="gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          Test Link
        </Button>
        <Button
          onClick={handleSave}
          disabled={!paymentLink || !!validationError || isSaving}
          className="gap-2"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Save
        </Button>
      </div>

      {/* Examples */}
      <div className="p-4 bg-muted rounded-lg border border-border">
        <p className="text-sm font-semibold mb-2">Popular payment links:</p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• <span className="font-mono">https://paypal.me/yourname</span></li>
          <li>• <span className="font-mono">https://venmo.com/@yourname</span></li>
          <li>• <span className="font-mono">https://buy.stripe.com/...</span></li>
          <li>• <span className="font-mono">https://square.cash/$yourname</span></li>
        </ul>
      </div>
    </div>
  );
}

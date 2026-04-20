import { useState } from "react";
import { Check, Zap, Loader2, AlertCircle, Sparkles, Crown } from "lucide-react";
import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import { useUser } from "@/store/user.store";

import { 
  type SubscriptionTier, 
  type BillingInterval, 
  type UserSubscription,
  FEATURES_PRO,
  PRICES,
  PRICE_IDS_STRIPE as PRICE_IDS,
  TIER_LABELS,
  MAGIC_CREDIT_LIMITS,
  getDaysUntilReset
} from "@/constants/pricing";

interface MySubscriptionSectionProps {
  subscription?: UserSubscription | null;
}

// ─── Current plan badge ───────────────────────────────────────────────────────

function CurrentPlanBadge({ subscription }: { subscription?: UserSubscription | null }) {
  const tier = subscription?.tier ?? "starter";
  const isActive = subscription?.status === "active";
  const isCanceling = subscription?.cancel_at_period_end;
  const credits = subscription?.magic_credits;
  const tierLimit = MAGIC_CREDIT_LIMITS[tier] ?? MAGIC_CREDIT_LIMITS.starter;
  const daysUntilReset = getDaysUntilReset(subscription?.credits_last_reset);

  return (
    <div className="flex flex-col gap-4 bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <Crown className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-bold tracking-tight">Current Plan</h3>
          <p className="text-sm text-muted-foreground">Your active subscription</p>
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className={cn(
            "text-lg font-extrabold tracking-tight",
            tier === "starter" ? "text-foreground" : "text-primary"
          )}>
            {TIER_LABELS[tier]}
          </span>
          {isActive && tier !== "starter" && (
            <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
              Active
            </span>
          )}
          {isCanceling && (
            <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
              Cancels at period end
            </span>
          )}
        </div>

        {subscription?.current_period_end && tier !== "starter" && (
          <p className="text-xs text-muted-foreground">
            {isCanceling ? "Access until" : "Renews"}{" "}
            {new Date(subscription.current_period_end).toLocaleDateString("en-US", {
              month: "long", day: "numeric", year: "numeric",
            })}
          </p>
        )}
      </div>

      {typeof credits === "number" && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4 border-t border-border mt-3">
          <Sparkles className={cn("h-4 w-4", credits < 5 ? "text-amber-500" : "text-primary")} />
          <span className={cn(credits < 5 && "text-amber-500 font-medium")}>
            <strong className="text-foreground">{credits}</strong> / {tierLimit} Magic AI generations remaining
            <span className="text-xs ml-1 opacity-80">(Resets in {daysUntilReset} days)</span>
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Upgrade card ─────────────────────────────────────────────────────────────

function UpgradeCard({
  billingInterval,
  setBillingInterval,
  onUpgrade,
  isLoading,
  error,
  isCurrentPro,
}: {
  billingInterval: BillingInterval;
  setBillingInterval: (v: BillingInterval) => void;
  onUpgrade: (priceId: string) => void;
  isLoading: boolean;
  error: string | null;
  isCurrentPro: boolean;
}) {
  const monthlyEquiv = billingInterval === "year"
    ? `$${Math.round(PRICES.pro.year / 12)}`
    : `$${PRICES.pro.month}`;

  const billedNote = billingInterval === "year"
    ? `Billed $${PRICES.pro.year}/yr — you save $${PRICES.pro.month * 12 - PRICES.pro.year}`
    : "Billed monthly, cancel anytime";

  const priceId = PRICE_IDS.pro[billingInterval];

  return (
    <div className="relative flex flex-col gap-6 bg-primary text-primary-foreground rounded-xl p-6 shadow-xl shadow-primary/20">
      <div className="absolute -top-3 left-6">
        <span className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[10px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full shadow">
          <Sparkles className="h-3 w-3" />
          Upgrade to Pro
        </span>
      </div>

      {/* Price + toggle */}
      <div className="flex items-start justify-between flex-wrap gap-4 pt-2">
        <div>
          <div className="flex items-end gap-1">
            <span className="text-4xl font-extrabold tracking-tight leading-none">{monthlyEquiv}</span>
            <span className="text-sm mb-1 text-primary-foreground/70">/mo</span>
          </div>
          <p className="text-xs text-primary-foreground/50 mt-1">{billedNote}</p>
        </div>

        {/* Interval pill toggle */}
        <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
          <button
            onClick={() => setBillingInterval("month")}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-bold transition-all",
              billingInterval === "month"
                ? "bg-white text-primary shadow-sm"
                : "text-primary-foreground/70 hover:text-primary-foreground"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingInterval("year")}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5",
              billingInterval === "year"
                ? "bg-white text-primary shadow-sm"
                : "text-primary-foreground/70 hover:text-primary-foreground"
            )}
          >
            Annual
            <span className="text-[9px] font-extrabold tracking-wider bg-emerald-400 text-white px-1.5 py-0.5 rounded-full">
              -20%
            </span>
          </button>
        </div>
      </div>

      {/* Features */}
      <ul className="flex flex-col gap-2.5">
        {FEATURES_PRO.map((feat) => (
          <li key={feat} className="flex items-center gap-2.5 text-sm">
            <span className="flex-shrink-0 w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
              <Check className="h-2.5 w-2.5 text-primary-foreground" />
            </span>
            {feat}
          </li>
        ))}
      </ul>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-xs bg-white/10 border border-white/20 px-3 py-2 rounded-lg">
          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* CTA */}
      <Button
        id="billing-upgrade-btn"
        onClick={() => onUpgrade(priceId)}
        disabled={isLoading || isCurrentPro || !priceId}
        className={cn(
          "w-full h-11 rounded-xl font-semibold bg-white text-primary hover:bg-white/90 transition-all",
          "disabled:bg-white/40 disabled:text-primary/40"
        )}
      >
        {isLoading ? (
          <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Redirecting to Stripe…</span>
        ) : isCurrentPro ? (
          <span className="flex items-center gap-2"><Check className="h-4 w-4" /> You're on Pro</span>
        ) : (
          <span className="flex items-center gap-2"><Zap className="h-4 w-4" /> Upgrade Now</span>
        )}
      </Button>

      <p className="text-[10px] text-primary-foreground/40 text-center -mt-2">
        Secured by Stripe. Cancel anytime from your account.
      </p>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function MySubscriptionSection({ subscription }: MySubscriptionSectionProps) {
  const { session } = useUser();
  const [billingInterval, setBillingInterval] = useState<BillingInterval>(
    subscription?.billing_interval ?? "month"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tier = subscription?.tier ?? "starter";
  const hasStripeBillingAccount = Boolean(subscription?.stripe_customer_id);
  const isCurrentPro =
    tier === "pro" &&
    subscription?.status === "active" &&
    subscription?.billing_interval === billingInterval;

  const handleUpgrade = async (priceId: string) => {
    if (!priceId) {
      setError("Price configuration is missing. Please contact support.");
      return;
    }
    const userId = session?.user?.id;
    if (!userId) {
      setError("You must be logged in to upgrade.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL ?? "http://localhost:4000"}/api/billing/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ priceId, userId }),
        }
      );

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload?.error ?? `Server error (${res.status})`);
      }

      const data = await res.json();
      if (!data.url) throw new Error("No checkout URL returned from server.");

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const handleManageViaStripe = async () => {
    if (isLoading) return;

    if (!session?.access_token) {
      setError("You must be logged in to manage billing.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL ?? "http://localhost:4000"}/api/billing/portal`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload?.error ?? `Server error (${res.status})`);
      }

      const data = await res.json();
      if (!data?.url || typeof data.url !== "string") {
        throw new Error("Invalid portal URL");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <Crown className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight">My Subscription</h2>
          <p className="text-sm text-muted-foreground">Manage your plan and account tier.</p>
        </div>
      </div>

      <CurrentPlanBadge subscription={subscription} />

      {/* Only show the upgrade card if not already on pro */}
      {tier !== "pro" && (
        <UpgradeCard
          billingInterval={billingInterval}
          setBillingInterval={setBillingInterval}
          onUpgrade={handleUpgrade}
          isLoading={isLoading}
          error={error}
          isCurrentPro={isCurrentPro}
        />
      )}

      {/* Already pro — show manage note */}
      {tier === "pro" && (
        <div className="flex flex-col gap-4 text-sm text-muted-foreground bg-muted/50 border border-border rounded-xl p-4">
          <p className="text-center">
            Manage your subscription, update payment methods, or cancel through Stripe.
          </p>
          {error && (
            <div className="flex items-center gap-2 text-xs bg-background border border-border px-3 py-2 rounded-lg">
              <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 text-destructive" />
              {error}
            </div>
          )}
          <Button
            onClick={handleManageViaStripe}
            disabled={isLoading || !hasStripeBillingAccount}
            className="w-full h-11 rounded-xl font-semibold"
          >
            {isLoading ? (
              <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Opening Stripe…</span>
            ) : (
              "Manage via Stripe"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

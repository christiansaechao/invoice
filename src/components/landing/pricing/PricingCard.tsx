import { Check, Sparkles, Zap } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/button";

// ─── Plan features ────────────────────────────────────────────────────────────

const FEATURES_STARTER = [
  "Up to 3 active clients",
  "5 invoices per month",
  "3 Magic AI generations",
  "Standard invoice templates",
  "Basic dashboard analytics",
];

const FEATURES_PRO = [
  "Unlimited clients",
  "Unlimited invoices",
  "50 Magic AI generations / month",
  "All 8 premium invoice templates",
  "Advanced dashboard & analytics",
  "Custom hourly rates",
  "Remove Receipts watermark",
  "Priority email support",
];

const PRICES = { pro: { month: 19, year: 180 } } as const;

// ─── Billing toggle ───────────────────────────────────────────────────────────

type BillingInterval = "month" | "year";

function BillingToggle({
  interval,
  onChange,
}: {
  interval: BillingInterval;
  onChange: (v: BillingInterval) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-4 mb-12">
      <span className={cn("text-sm font-semibold transition-colors", interval === "month" ? "text-foreground" : "text-muted-foreground")}>
        Monthly
      </span>

      <button
        id="billing-interval-toggle"
        role="switch"
        aria-checked={interval === "year"}
        onClick={() => onChange(interval === "month" ? "year" : "month")}
        className={cn(
          "relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          interval === "year" ? "bg-primary" : "bg-muted"
        )}
      >
        <span className={cn(
          "absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300",
          interval === "year" ? "translate-x-7" : "translate-x-0"
        )} />
      </button>

      <span className={cn("text-sm font-semibold transition-colors", interval === "year" ? "text-foreground" : "text-muted-foreground")}>
        Annual
      </span>

      <span className={cn(
        "text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full transition-all duration-300",
        interval === "year"
          ? "bg-emerald-100 text-emerald-700 opacity-100 scale-100"
          : "opacity-0 scale-90 pointer-events-none"
      )}>
        Save 20%
      </span>
    </div>
  );
}

// ─── Single card ──────────────────────────────────────────────────────────────

function PlanCard({
  name,
  tierLabel,
  description,
  monthlyEquiv,
  billedNote,
  features,
  featured,
  ctaLabel,
  ctaHref,
}: {
  name: string;
  tierLabel: string;
  description: string;
  monthlyEquiv: string;
  billedNote?: string;
  features: string[];
  featured: boolean;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <div className={cn(
      "relative flex flex-col rounded-2xl border p-8 transition-all duration-200",
      featured
        ? "bg-primary text-primary-foreground border-primary shadow-2xl shadow-primary/25 scale-[1.02]"
        : "bg-card border-border shadow-sm hover:shadow-md"
    )}>
      {featured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[10px] font-extrabold tracking-widest uppercase px-4 py-1.5 rounded-full shadow-lg">
            <Sparkles className="h-3 w-3" />
            Most Popular
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <p className={cn("text-[10px] font-bold tracking-widest uppercase mb-2", featured ? "text-primary-foreground/60" : "text-muted-foreground")}>
          {tierLabel}
        </p>
        <h3 className="text-2xl font-bold mb-1">{name}</h3>
        <p className={cn("text-sm", featured ? "text-primary-foreground/70" : "text-muted-foreground")}>
          {description}
        </p>
      </div>

      {/* Price */}
      <div className="mb-8">
        <div className="flex items-end gap-1">
          <span className="text-5xl font-extrabold tracking-tight leading-none">{monthlyEquiv}</span>
          {monthlyEquiv !== "Free" && (
            <span className={cn("text-sm mb-1.5", featured ? "text-primary-foreground/70" : "text-muted-foreground")}>/mo</span>
          )}
        </div>
        {billedNote && (
          <p className={cn("text-xs mt-1", featured ? "text-primary-foreground/50" : "text-muted-foreground")}>
            {billedNote}
          </p>
        )}
      </div>

      {/* Features */}
      <ul className="flex flex-col gap-3 mb-10 flex-1">
        {features.map((feat) => (
          <li key={feat} className="flex items-start gap-3 text-sm">
            <span className={cn("mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center", featured ? "bg-white/20" : "bg-accent")}>
              <Check className={cn("h-3 w-3", featured ? "text-primary-foreground" : "text-primary")} />
            </span>
            {feat}
          </li>
        ))}
      </ul>

      {/* CTA — always a link to sign-up on the public page */}
      <Link to={ctaHref}>
        <Button
          className={cn(
            "w-full h-12 rounded-xl font-semibold text-sm",
            featured ? "bg-white text-primary hover:bg-white/90" : ""
          )}
          variant={featured ? "secondary" : "default"}
        >
          {featured ? (
            <span className="flex items-center gap-2"><Zap className="h-4 w-4" />{ctaLabel}</span>
          ) : ctaLabel}
        </Button>
      </Link>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function PricingCards() {
  const [billingInterval, setBillingInterval] = useState<BillingInterval>("month");

  const proMonthlyEquiv = billingInterval === "year"
    ? `$${Math.round(PRICES.pro.year / 12)}`
    : `$${PRICES.pro.month}`;

  const proBilledNote = billingInterval === "year"
    ? `Billed $${PRICES.pro.year}/yr — save $${PRICES.pro.month * 12 - PRICES.pro.year}`
    : "Billed monthly, cancel anytime";

  return (
    <section className="px-6 md:px-12 max-w-4xl mx-auto pb-24">
      <BillingToggle interval={billingInterval} onChange={setBillingInterval} />

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <PlanCard
          name="Starter"
          tierLabel="Free Tier"
          description="Perfect for freelancers just starting their journey."
          monthlyEquiv="Free"
          features={FEATURES_STARTER}
          featured={false}
          ctaLabel="Get Started Free"
          ctaHref="/sign-up"
        />
        <PlanCard
          name="Pro"
          tierLabel="Professional"
          description="Everything you need to manage a growing creative business."
          monthlyEquiv={proMonthlyEquiv}
          billedNote={proBilledNote}
          features={FEATURES_PRO}
          featured={true}
          ctaLabel="Start Free Trial"
          ctaHref="/sign-up?plan=pro"
        />
      </div>
    </section>
  );
}

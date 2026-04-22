import { Check, Sparkles, Zap } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import { 
  FEATURES_STARTER, 
  FEATURES_PRO, 
  PRICES, 
  type BillingInterval 
} from "@/constants/pricing";

// ─── Billing toggle ───────────────────────────────────────────────────────────

function BillingToggle({
  interval,
  onChange,
}: {
  interval: BillingInterval;
  onChange: (v: BillingInterval) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-4 mb-12 text-slate-900">
      <span className={cn("text-sm font-semibold transition-colors", interval === "month" ? "text-slate-900" : "text-slate-400")}>
        Monthly
      </span>

      <button
        id="billing-interval-toggle"
        role="switch"
        aria-checked={interval === "year"}
        onClick={() => onChange(interval === "month" ? "year" : "month")}
        className={cn(
          "relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6200EE]",
          interval === "year" ? "bg-[#6200EE]" : "bg-slate-200"
        )}
      >
        <span className={cn(
          "absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300",
          interval === "year" ? "translate-x-7" : "translate-x-0"
        )} />
      </button>

      <span className={cn("text-sm font-semibold transition-colors", interval === "year" ? "text-slate-900" : "text-slate-400")}>
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
        ? "bg-[#6200EE] text-white border-[#6200EE] shadow-2xl shadow-[#6200EE]/25 scale-[1.02]"
        : "bg-white border-slate-200 shadow-sm hover:shadow-md"
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
        <p className={cn("text-[10px] font-bold tracking-widest uppercase mb-2", featured ? "text-white/60" : "text-slate-500")}>
          {tierLabel}
        </p>
        <h3 className={cn("text-2xl font-bold mb-1", featured ? "text-white" : "text-slate-900")}>{name}</h3>
        <p className={cn("text-sm", featured ? "text-white/70" : "text-slate-500")}>
          {description}
        </p>
      </div>

      {/* Price */}
      <div className="mb-8">
        <div className="flex items-end gap-1">
          <span className={cn("text-5xl font-extrabold tracking-tight leading-none", featured ? "text-white" : "text-slate-900")}>{monthlyEquiv}</span>
          {monthlyEquiv !== "Free" && (
            <span className={cn("text-sm mb-1.5", featured ? "text-white/70" : "text-slate-500")}>/mo</span>
          )}
        </div>
        {billedNote && (
          <p className={cn("text-xs mt-1", featured ? "text-white/50" : "text-slate-500")}>
            {billedNote}
          </p>
        )}
      </div>

      {/* Features */}
      <ul className="flex flex-col gap-3 mb-10 flex-1">
        {features.map((feat) => (
          <li key={feat} className={cn("flex items-start gap-3 text-sm", featured ? "text-white/90" : "text-slate-600")}>
            <span className={cn("mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center", featured ? "bg-white/20" : "bg-slate-100")}>
              <Check className={cn("h-3 w-3", featured ? "text-white" : "text-[#6200EE]")} />
            </span>
            {feat}
          </li>
        ))}
      </ul>

      {/* CTA — locked to brand colors */}
      <Link to={ctaHref}>
        <Button
          className={cn(
            "w-full h-12 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90",
            featured ? "bg-white text-[#6200EE]" : "bg-[#6200EE] text-white"
          )}
          style={featured ? {} : { backgroundColor: "#6200EE", color: "white" }}
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

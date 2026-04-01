import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/constants/pricing";
import type { Plan } from "@/constants/pricing";

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-8 transition-shadow ${
        plan.featured
          ? "bg-primary text-primary-foreground border-primary shadow-2xl shadow-primary/20"
          : "bg-white border-border shadow-sm hover:shadow-md"
      }`}
    >
      {plan.featured && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-bold tracking-widest uppercase px-4 py-1 rounded-full">
          Pro Plan Choice
        </span>
      )}

      <div className={`text-[10px] font-bold tracking-widest uppercase mb-3 ${plan.featured ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
        {plan.tier}
      </div>

      <h2 className="text-2xl font-bold mb-1">{plan.name}</h2>

      <div className="flex items-end gap-1 mb-2">
        <span className="text-5xl font-bold tracking-tight">{plan.price}</span>
        <span className={`text-sm mb-2 ${plan.featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          {plan.period}
        </span>
      </div>

      <p className={`text-sm mb-8 ${plan.featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
        {plan.description}
      </p>

      <ul className="flex flex-col gap-3 mb-10 flex-1">
        {plan.features.map((feat) => (
          <li key={feat} className="flex items-center gap-3 text-sm">
            <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${plan.featured ? "bg-white/20" : "bg-blue-100"}`}>
              <Check className={`h-3 w-3 ${plan.featured ? "text-white" : "text-blue-600"}`} />
            </span>
            {feat}
          </li>
        ))}
      </ul>

      <Link to={plan.ctaHref}>
        <Button
          className={`w-full rounded-full h-11 font-semibold ${
            plan.featured
              ? "bg-white text-primary hover:bg-white/90"
              : ""
          }`}
          variant={plan.featured ? "secondary" : "default"}
        >
          {plan.cta}
        </Button>
      </Link>
    </div>
  );
}

export function PricingHero() {
  return (
    <section className="py-20 md:py-28 px-6 md:px-12 text-center max-w-4xl mx-auto space-y-4">
      <h1 className="text-4xl md:text-6xl font-serif font-medium leading-tight text-primary">
        Simple pricing. No hidden fees.<br />
        <span className="italic">Just faster payouts.</span>
      </h1>
      <p className="text-muted-foreground text-lg">
        Choose the plan that fits your freelance workflow.
      </p>
    </section>
  );
}

export function PricingCards() {
  return (
    <section className="px-6 md:px-12 max-w-4xl mx-auto pb-24">
      <div className="grid md:grid-cols-2 gap-6 items-start">
        {PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </section>
  );
}

import { LandingNav } from "@/components/landing/LandingNav";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { PricingHero, PricingCards } from "@/components/landing/PricingSection";
import { ComparisonTable } from "@/components/landing/ComparisonTable";
import { FaqSection } from "@/components/landing/FaqSection";
import { PricingCta } from "@/components/landing/PricingCta";

export function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <LandingNav />

      <main className="flex-1">
        <PricingHero />
        <PricingCards />
        <ComparisonTable />
        <FaqSection />
        <PricingCta />
      </main>

      <LandingFooter />
    </div>
  );
}

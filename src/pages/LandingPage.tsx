import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { MarqueeSection } from "@/components/landing/MarqueeSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { DashboardPreviewSection } from "@/components/landing/DashboardPreviewSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <LandingNav />

      <main className="flex-1">
        <HeroSection />
        <MarqueeSection />
        <FeaturesSection />
        <DashboardPreviewSection />
        <TestimonialsSection />
      </main>

      <LandingFooter />
    </div>
  );
}

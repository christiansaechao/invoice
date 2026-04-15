import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CTA_HEADLINE, CTA_SUBTEXT, CTA_PRIMARY, CTA_SECONDARY, SOCIAL_PROOF } from "@/constants/pricing";

export function PricingCta() {
  return (
    <section className="mx-6 md:mx-12 mb-24 rounded-3xl bg-slate-900 text-white px-8 md:px-16 py-20 text-center max-w-5xl md:mx-auto">
      <h2 className="text-3xl md:text-5xl font-serif font-medium leading-tight mb-4 max-w-2xl mx-auto">
        {CTA_HEADLINE}
      </h2>
      <p className="text-white/60 text-base mb-10 max-w-md mx-auto">
        {CTA_SUBTEXT}
      </p>
      <div className="flex justify-center">
        <Link to="/sign-up">
          <Button className="rounded-full px-8 h-12 bg-white text-slate-900 hover:bg-white/90 font-semibold text-base">
            {CTA_PRIMARY}
          </Button>
        </Link>
      </div>
      <p className="text-white/40 text-xs mt-8">{SOCIAL_PROOF}</p>
    </section>
  );
}

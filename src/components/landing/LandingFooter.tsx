import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import { BRAND_NAME } from "@/constants/pricing";

const FOOTER_LINKS = ["Terms", "Privacy", "Contact"];

export function LandingFooter() {
  return (
    <footer className="flex flex-col">

      {/* ── Pre-footer CTA card ── */}
      <div className="px-6 md:px-12 py-16 bg-muted/20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-xl border border-border/50">

          {/* Left panel — copy */}
          <div className="bg-white p-10 flex flex-col gap-5">
            <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-primary">
              Creative Studio Dashboard
            </span>

            <h2 className="text-3xl md:text-4xl font-serif font-extrabold text-foreground leading-tight">
              The future of{" "}
              <span className="text-primary">creator<br />finance</span>{" "}
              is here.
            </h2>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Manage your income streams, generate high-end receipts, and build
              a creative empire with tools designed for the modern influencer.
            </p>
          </div>

          {/* Right panel — solid purple stat */}
          <div
            className="flex flex-col justify-between p-10"
            style={{ background: "#6200EE" }}
          >
            <div className="flex flex-col gap-2">
              <span className="text-white/70 text-sm font-semibold">Total Earnings</span>
              <span className="text-white text-4xl font-extrabold tabular-nums leading-none">
                $142,850.00
              </span>
            </div>

            {/* Growth pill */}
            <div className="flex items-center gap-2 mt-auto pt-10">
              <span
                className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full text-white"
                style={{ background: "rgba(255,255,255,0.15)" }}
              >
                <TrendingUp className="h-3.5 w-3.5" />
                +12% this month
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Full-width purple CTA + copyright bar ── */}
      <div
        className="flex flex-col items-center gap-10 pt-20 pb-10 px-6 text-white"
        style={{
          background: "linear-gradient(135deg, #6200EE 0%, #7c3aed 100%)",
        }}
      >
        {/* Big CTA headline */}
        <div className="text-center flex flex-col gap-8 items-center">
          <h2 className="text-4xl md:text-5xl font-serif font-extrabold leading-tight max-w-xl">
            Stop sending boring PDFs.<br />Start sending Receipts.
          </h2>

          <Link to="/sign-up">
            <Button
              size="lg"
              className="rounded-full px-10 h-12 text-base font-bold text-foreground"
              style={{ background: "#03DAC6", color: "#121212" }}
            >
              Create Your First Receipt
            </Button>
          </Link>
        </div>

        {/* Bottom bar */}
        <div className="w-full max-w-5xl flex items-center justify-between mt-8 pt-6 border-t border-white/20 text-sm text-white/60">
          <span className="font-bold text-white text-base">{BRAND_NAME}</span>
          <span className="hidden md:block">© {new Date().getFullYear()} Receipts. All rights reserved.</span>
          <div className="flex items-center gap-5">
            {FOOTER_LINKS.map((link) => (
              <span
                key={link}
                className="hover:text-white transition-colors cursor-pointer"
              >
                {link}
              </span>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}

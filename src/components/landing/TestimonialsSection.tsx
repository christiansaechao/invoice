import { Zap, Wallet } from "lucide-react";

// ─── Revenue stream stats (bottom panel) ─────────────────────────────────────
const REVENUE_STREAMS = [
  { label: "BRAND DEALS",  value: "$42,500" },
  { label: "AD REVENUE",   value: "$18,200" },
  { label: "AFFILIATES",   value: "$9,400"  },
  { label: "MERCH",        value: "$12,100" },
  { label: "COURSES",      value: "$38,000" },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 px-6 md:px-12 bg-muted/20">
      <div className="max-w-5xl mx-auto flex flex-col gap-12">

        {/* ── Section header ── */}
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-primary">
            Creator Spotlight
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-extrabold text-foreground">
            Trusted by the new economy.
          </h2>
        </div>

        {/* ── Two-column: testimonial + stat cards ── */}
        <div className="grid md:grid-cols-[1fr_220px] gap-5 items-start">

          {/* Left — testimonial card */}
          <div className="bg-white rounded-3xl border border-border/50 shadow-sm p-8 flex flex-col gap-6 relative overflow-hidden">
            {/* Large decorative quotation mark */}
            <span
              className="absolute top-6 left-7 text-7xl font-serif leading-none select-none"
              style={{ color: "#6200EE", opacity: 0.15 }}
            >
              "
            </span>

            {/* Author row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  AR
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-bold text-foreground text-sm">Alex Rivera</span>
                  <span className="text-xs text-muted-foreground">@rivera_creative</span>
                </div>
              </div>
              {/* Verified check */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: "#f0e6ff" }}
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="#6200EE">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>

            {/* Quote body */}
            <p className="text-xl md:text-2xl font-bold text-foreground leading-snug">
              "Finally, an invoicer that doesn't look like it was designed in 2005. I send the{" "}
              <span className="text-primary">receipts</span>, secure the bag, and focus on content."
            </p>

            {/* Badges */}
            <div className="flex items-center gap-3 mt-auto">
              <span
                className="text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full text-white"
                style={{ background: "#03DAC6" }}
              >
                Creative Director
              </span>
              <span className="text-[11px] font-semibold text-muted-foreground border border-border rounded-full px-3 py-1.5">
                Verified User
              </span>
            </div>
          </div>

          {/* Right — stat cards stacked */}
          <div className="flex flex-col gap-4">

            {/* Stat card 1 — primary purple */}
            <div className="rounded-2xl p-6 flex flex-col gap-3" style={{ background: "#6200EE" }}>
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-3xl font-extrabold text-white tabular-nums">2.4x</p>
                <p className="text-[11px] text-white/70 leading-snug mt-1">
                  Faster payment processing for Alex since switching to Receipts.
                </p>
              </div>
            </div>

            {/* Stat card 2 — white */}
            <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-6 flex flex-col gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "#f0e6ff" }}
              >
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-extrabold text-foreground tabular-nums">$120k+</p>
                <p className="text-[11px] text-muted-foreground leading-snug mt-1">
                  Annual revenue managed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Revenue streams bottom panel ── */}
        <div className="bg-white rounded-3xl border border-border/50 shadow-sm px-8 py-7 flex flex-col gap-5">
          {/* Panel header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-bold text-foreground">Revenue Streams</h3>
              <p className="text-sm text-muted-foreground max-w-xs leading-snug">
                How modern creators like Alex diversify their earnings using our platform.
              </p>
            </div>
            <button className="flex items-center gap-1 text-sm font-semibold text-primary hover:opacity-70 transition-opacity whitespace-nowrap mt-1">
              View full analytics <span>→</span>
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {REVENUE_STREAMS.map((s) => (
              <div key={s.label} className="flex flex-col gap-1">
                <span className="text-[9px] font-bold tracking-[0.18em] uppercase text-muted-foreground">
                  {s.label}
                </span>
                <span className="text-xl font-extrabold text-foreground tabular-nums">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

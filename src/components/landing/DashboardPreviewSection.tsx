import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";

// ─── Donut chart data (SVG) ───────────────────────────────────────────────────
const DONUT_SEGMENTS = [
  { label: "Brand Deals", pct: 60, color: "#6200EE" },   // primary
  { label: "Affiliates",  pct: 25, color: "#03DAC6" },   // secondary
  { label: "Consulting",  pct: 15, color: "#FF0266" },   // destructive
];

// SVG donut — r=52, circumference ≈ 326.7
const R = 52;
const CIRC = 2 * Math.PI * R;
function buildSegments() {
  let offset = -CIRC * 0.25; // start at 12 o'clock
  return DONUT_SEGMENTS.map((seg) => {
    const dash = CIRC * (seg.pct / 100);
    const el = { ...seg, dash, gap: CIRC - dash, offset };
    offset -= dash;
    return el;
  });
}
const SEGMENTS = buildSegments();

// ─── Recent collabs ───────────────────────────────────────────────────────────
const COLLABS = [
  {
    name: "Vogue Global",
    badge: "Paid",
    badgeStyle: { bg: "bg-secondary/20", text: "text-secondary-foreground", border: "border-secondary/30" },
    badgeColor: { background: "#e0faf7", color: "#007a6e" },
    amount: "$4,500",
    type: "INFLUENCER CAMPAIGN",
  },
  {
    name: "Aesthetic Skincare",
    badge: "Pending",
    badgeColor: { background: "#f1f5f9", color: "#64748b" },
    amount: "$2,200",
    type: "UGC VIDEO BUNDLE",
  },
  {
    name: "Tech Gear Hub",
    badge: "Overdue",
    badgeColor: { background: "#ffe4ed", color: "#FF0266" },
    amount: "$1,150",
    type: "NEWSLETTER SPONSOR",
  },
];

// ─── Bottom stat bar ──────────────────────────────────────────────────────────
const BOTTOM_STATS = [
  { label: "DIRECT REV",  value: "$9,840",   color: "text-slate-900" },
  { label: "AFFILIATE",   value: "$4,210",   color: "text-slate-900" },
  { label: "GROWTH",      value: "+14.2%",   color: "text-[#03DAC6]"  },
];

// ─── Hero stats ───────────────────────────────────────────────────────────────
const HERO_STATS = [
  { value: "2.4k+", label: "ACTIVE CREATORS" },
  { value: "$12M+", label: "PROCESSED" },
];

export function DashboardPreviewSection() {
  return (
    <section
      className="py-24 px-6 md:px-12"
      style={{ background: "linear-gradient(160deg, #f5f0ff 0%, #f8fffe 60%, #fff0f6 100%)" }}
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

        {/* ── Left copy ── */}
        <div className="flex flex-col gap-7">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#6200EE]">
            The Future of Finance
          </span>

          <h2
            className="font-serif font-extrabold leading-[1.05] text-slate-900"
            style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}
          >
            Own Your<br />Income Stream
          </h2>

          <p className="text-slate-600 text-base leading-relaxed max-w-sm">
            Track brand deals, affiliate links, and consulting revenue
            in real-time. Precision management for the modern creative professional.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link to="/sign-up">
              <Button className="bg-[#6200EE] text-white hover:bg-[#6200EE]/90 rounded-xl px-7 h-11 font-semibold">
                Explore Dashboard
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" className="rounded-xl px-7 h-11 font-semibold bg-white text-slate-900 hover:bg-slate-50 border-slate-200">
                View Sample Report
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-10 pt-2">
            {HERO_STATS.map((s) => (
              <div key={s.label} className="flex flex-col gap-0.5">
                <span className="text-3xl font-extrabold text-slate-900 tabular-nums">{s.value}</span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: dashboard mock ── */}
        <div className="relative">
          {/* Glow */}
          <div
            className="absolute -top-10 -right-10 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ background: "#03DAC6" }}
          />

          <div className="relative z-10 bg-white rounded-3xl shadow-2xl border border-border/50 overflow-hidden">

            {/* Browser chrome top bar */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/50">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-destructive" />
                <span className="w-3 h-3 rounded-full" style={{ background: "#03DAC6" }} />
                <span className="w-3 h-3 rounded-full bg-border" />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-1 rounded-lg">
                <CalendarDays className="h-3.5 w-3.5" />
                Aug 2024
              </div>
            </div>

            {/* Main content — two columns */}
            <div className="grid grid-cols-2 divide-x divide-border/50">

              {/* Left: donut chart */}
              <div className="p-5 flex flex-col gap-4">
                <p className="text-[9px] font-bold tracking-[0.18em] uppercase text-muted-foreground leading-tight">
                  Revenue<br />Breakdown
                </p>

                {/* SVG donut */}
                <div className="flex items-center justify-center py-2">
                  <div className="relative w-36 h-36">
                    <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                      {SEGMENTS.map((seg) => (
                        <circle
                          key={seg.label}
                          cx="60" cy="60" r={R}
                          fill="none"
                          stroke={seg.color}
                          strokeWidth="14"
                          strokeDasharray={`${seg.dash} ${seg.gap}`}
                          strokeDashoffset={seg.offset}
                          strokeLinecap="round"
                        />
                      ))}
                    </svg>
                    {/* Center label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-lg font-extrabold text-slate-900 tabular-nums">$18.2k</span>
                      <span className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold">Total Profit</span>
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex flex-col gap-1.5">
                  {DONUT_SEGMENTS.map((seg) => (
                    <div key={seg.label} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: seg.color }} />
                        <span className="text-muted-foreground">{seg.label}</span>
                      </div>
                      <span className="font-semibold text-foreground">{seg.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: collab list */}
              <div className="p-5 flex flex-col gap-3">
                <p className="text-[9px] font-bold tracking-[0.18em] uppercase text-slate-500">
                  Recent Collabs
                </p>

                {COLLABS.map((c) => (
                  <div key={c.name} className="bg-slate-50 rounded-xl p-3 flex flex-col gap-1.5 border border-slate-100">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-slate-900 leading-tight">{c.name}</span>
                      <span
                        className="text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                        style={c.badgeColor}
                      >
                        {c.badge}
                      </span>
                    </div>
                    <span className="text-sm font-extrabold text-slate-900 tabular-nums">{c.amount}</span>
                    <span className="text-[9px] font-semibold tracking-widest uppercase text-slate-500">{c.type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom stats bar */}
            <div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 bg-slate-50">
              {BOTTOM_STATS.map((s) => (
                <div key={s.label} className="px-4 py-3 flex flex-col gap-0.5">
                  <span className="text-[9px] font-bold tracking-widest uppercase text-slate-500">{s.label}</span>
                  <span className={`text-base font-extrabold tabular-nums ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

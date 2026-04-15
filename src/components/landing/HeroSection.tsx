import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp, CheckCircle2, Clock } from "lucide-react";

const AVATARS = [
  { initials: "MR", bg: "bg-violet-400" },
  { initials: "SC", bg: "bg-teal-400" },
  { initials: "JO", bg: "bg-pink-400" },
];

const STATS = [
  { label: "ACTIVE CLIENTS", value: "$12,400" },
  { label: "PENDING", value: "$4,210" },
  { label: "EARNED THIS MO.", value: "$8,229" },
];

const MOCK_INVOICES = [
  { name: "Accelerate Education", sub: "Due in 2 days", status: "Paid", paid: true },
  { name: "Blue Horizon Studio", sub: "Pending approval", status: "Pending", paid: false },
];

const LOGO_BUBBLES = [
  { label: "AE", top: "top-4", right: "right-4", size: "w-14 h-14" },
  { label: "BH", top: "top-1/2", right: "-right-8", size: "w-12 h-12" },
];

export function HeroSection() {
  return (
    <section
      className="relative min-h-[88vh] flex flex-col justify-center overflow-hidden px-8 md:px-16 lg:px-24"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 70% 40%, rgba(98,0,238,0.08) 0%, transparent 70%), linear-gradient(160deg, #f5f0ff 0%, #f8fffe 50%, #fff0f6 100%)",
      }}
    >
      <div className="relative z-10 grid md:grid-cols-2 gap-12 lg:gap-20 items-center max-w-7xl mx-auto w-full py-20">

        {/* ── Left copy ── */}
        <div className="flex flex-col gap-7">
          <h1 className="text-[clamp(2.8rem,6vw,5rem)] font-serif font-extrabold leading-[1.05] tracking-tight text-foreground">
            Send the Receipt.
            <br />
            <span className="text-primary">Get Paid Faster.</span>
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
            The professional invoicing platform built for freelancers, creators,
            and independent contractors who mean business.
          </p>

          <div className="flex flex-wrap items-center gap-5">
            <Link to="/sign-up">
              <Button
                size="lg"
                className="rounded-full px-8 h-12 text-base shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow cursor-pointer"
              >
                Send Receipts
              </Button>
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {AVATARS.map((a) => (
                  <div
                    key={a.initials}
                    className={`${a.bg} w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold`}
                  >
                    {a.initials}
                  </div>
                ))}
              </div>
              <span className="text-sm text-muted-foreground font-medium">
                Joined by <strong className="text-foreground">12k+</strong> freelancers
              </span>
            </div>
          </div>

          <div className="mt-4 pt-6 border-t border-border/50">
            <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-4">
              Live Income Overview
            </p>
            <div className="flex flex-wrap gap-8">
              {STATS.map((s) => (
                <div key={s.label} className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
                    {s.label}
                  </span>
                  <span className="text-2xl font-bold text-foreground tabular-nums">
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right — floating earnings card ── */}
        <div className="relative flex items-center justify-center">
          {/* Teal glow blob */}
          <div
            className="absolute w-80 h-80 rounded-full blur-3xl opacity-30 pointer-events-none"
            style={{ background: "radial-gradient(circle, #03DAC6 0%, transparent 70%)" }}
          />

          {/* Card with purple left accent */}
          <div className="relative z-10 bg-white rounded-3xl shadow-2xl border border-border/60 w-full max-w-sm overflow-hidden">
            {/* Purple accent stripe */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />

            {/* Card content */}
            <div className="p-7">
              {/* Header row */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">
                    Total Earnings
                  </p>
                  <p className="text-4xl font-extrabold tabular-nums text-foreground">
                    $24,840<span className="text-2xl">.00</span>
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-teal-600" />
                </div>
              </div>

              {/* Invoice rows */}
              <div className="flex flex-col gap-2">
                {MOCK_INVOICES.map((inv) => (
                  <div
                    key={inv.name}
                    className="flex items-center justify-between bg-muted/40 rounded-2xl px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                        {inv.paid
                          ? <CheckCircle2 className="h-4 w-4 text-primary" />
                          : <Clock className="h-4 w-4 text-muted-foreground" />
                        }
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground leading-tight">{inv.name}</p>
                        <p className="text-xs text-muted-foreground">{inv.sub}</p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full ${inv.paid ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                        }`}
                    >
                      {inv.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating logo bubbles */}
          {LOGO_BUBBLES.map((b) => (
            <div
              key={b.label}
              className={`absolute ${b.top} ${b.right} ${b.size} bg-white rounded-2xl shadow-lg border border-border/50 flex items-center justify-center font-bold text-sm text-primary z-20`}
            >
              {b.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

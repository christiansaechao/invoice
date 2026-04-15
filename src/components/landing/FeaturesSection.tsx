import { Brush, Tag, TrendingUp } from "lucide-react";

// ─── Top feature cards ────────────────────────────────────────────────────────
const FEATURE_CARDS = [
  {
    id: "brand-deals",
    accent: "bg-secondary",           // teal — #03DAC6
    iconBg: "bg-secondary/20",
    iconColor: "text-secondary-foreground",
    icon: <Brush className="h-5 w-5" style={{ color: "#03DAC6" }} />,
    title: "Brand Deals, Done Right.",
    desc: "Generate clean, sleek receipts for collaborations and usage rights. Keep your partnership professional and your data structured.",
    cta: "Explore Templates",
    ctaColor: "text-primary",
  },
  {
    id: "affiliate",
    accent: "bg-destructive",         // pink-red — #FF0266
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
    icon: <Tag className="h-5 w-5 text-destructive" />,
    title: "Track Affiliate Income.",
    desc: "Effortlessly log commission payments and affiliate payouts. Centralize every link click and conversion into high-fidelity reports.",
    cta: "Manage Payouts",
    ctaColor: "text-destructive",
  },
];

// ─── Bottom bullet points ─────────────────────────────────────────────────────
const BULLETS = [
  {
    title: "Automated Revenue Streaming",
    desc: "Real-time tracking of platform payouts directly synced to your creator studio.",
  },
  {
    title: "Tax-Ready Export",
    desc: "One-click data formatting for accounting software and CPA reviews.",
  },
];

function FeatureCard({ card }: { card: typeof FEATURE_CARDS[0] }) {
  return (
    <div className="relative bg-white rounded-2xl shadow-sm border border-border overflow-hidden flex flex-col gap-4 p-7">
      {/* Colored left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${card.accent}`} />

      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center`}>
        {card.icon}
      </div>

      {/* Copy */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold text-foreground">{card.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
      </div>

      {/* CTA link */}
      <button className={`text-sm font-semibold ${card.ctaColor} flex items-center gap-1 hover:opacity-70 transition-opacity mt-auto`}>
        {card.cta} <span>→</span>
      </button>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto flex flex-col gap-20">

      {/* ── Part 1: Header + cards ── */}
      <div className="flex flex-col gap-12">
        {/* Section header */}
        <div className="text-center flex flex-col items-center gap-4">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">
            Modular Financial Tools
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-extrabold leading-tight text-foreground">
            Master Your Creative
            <br />
            <span className="text-primary">Revenue Streams</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-md leading-relaxed">
            Professional tools built for creators. Manage brand deals, affiliate
            payouts, and usage rights in one fluid ecosystem.
          </p>
        </div>

        {/* Feature cards */}
        <div className="relative">
          <div className="grid md:grid-cols-2 gap-6">
            {FEATURE_CARDS.map((card) => (
              <FeatureCard key={card.id} card={card} />
            ))}
          </div>

          {/* Floating success pill */}
          <div
            className="absolute -bottom-5 right-4 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white shadow-lg"
            style={{ background: "#03DAC6" }}
          >
            <span className="w-2 h-2 rounded-full bg-white" />
            Receipt Generated Successfully
          </div>
        </div>
      </div>

      {/* ── Part 2: Text left + dark image right ── */}
      <div className="grid md:grid-cols-2 gap-12 items-center pt-8">

        {/* Left: headline + bullets */}
        <div className="flex flex-col gap-8">
          <h2 className="text-4xl md:text-5xl font-serif font-extrabold leading-[1.1] text-foreground">
            Beyond Standard<br />Bookkeeping.
          </h2>

          <ul className="flex flex-col gap-6">
            {BULLETS.map((b) => (
              <li key={b.title} className="flex items-start gap-4">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-foreground text-sm">{b.title}</span>
                  <span className="text-sm text-muted-foreground leading-relaxed">{b.desc}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: dark chart card */}
        <div className="relative rounded-2xl overflow-hidden shadow-xl">
          {/* Dark bar-chart background image */}
          <img
            src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop"
            alt="Revenue analytics chart"
            className="w-full h-80 object-cover"
            style={{ filter: "brightness(0.55)" }}
          />

          {/* Revenue stat card overlay */}
          <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-white text-2xl font-extrabold tabular-nums">$14,250.00</p>
              <p className="text-white/60 text-[10px] uppercase tracking-widest font-semibold mt-0.5">
                Total Q3 Revenue
              </p>
            </div>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "#03DAC6" }}
            >
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}

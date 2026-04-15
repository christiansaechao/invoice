// Brand icons rendered as simple SVG shapes / stylized text to avoid external deps
// Each item: label shown in the marquee, plus a small icon element

type Brand = {
  name: string;
  icon: string; // emoji or symbol that represents the brand visually
};

const BRANDS: Brand[] = [
  { name: "TikTok",     icon: "▶" },
  { name: "Instagram",  icon: "◎" },
  { name: "Shopify",    icon: "🛍" },
  { name: "Vogue",      icon: "✦" },
  { name: "Nike",       icon: "✔" },
  { name: "YouTube",    icon: "▶" },
  { name: "Patreon",    icon: "◉" },
  { name: "Substack",   icon: "✉" },
];

export function MarqueeSection() {
  // Duplicate for seamless infinite loop
  const items = [...BRANDS, ...BRANDS];

  return (
    <section className="py-10 border-y border-border/40 bg-white overflow-hidden">
      <p className="text-center text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase mb-7">
        Used by creators working with
      </p>

      <div className="relative flex">
        {/* Fade masks */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-28 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-28 bg-gradient-to-l from-white to-transparent z-10" />

        <div
          className="flex items-center gap-14 whitespace-nowrap"
          style={{ animation: "marquee-scroll 30s linear infinite" }}
        >
          {items.map((brand, i) => (
            <div
              key={`${brand.name}-${i}`}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-default select-none"
            >
              <span className="text-base leading-none">{brand.icon}</span>
              <span className="text-sm font-semibold tracking-tight">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

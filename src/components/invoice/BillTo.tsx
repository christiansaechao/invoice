import { useSettings } from "@/store/settings.store";
import type { BillToInfo } from "@/store/settings.store";
import { TEMPLATE_THEMES } from "@/constants/template-themes";

export type BillToVariant =
  | "default"
  | "minimal"
  | "luxury"
  | "spa"
  | "studio"
  | "botanical"
  | "corporate"
  | "artisan";

interface BillToProps {
  override?: BillToInfo;
  variant?: BillToVariant;
}

export function BillTo({ override, variant = "default" }: BillToProps) {
  const { billTo: defaultBillTo } = useSettings();
  const billTo = override || defaultBillTo;

  const name = billTo.companyName || billTo.manager || "Client Name";
  const contact = billTo.companyName ? billTo.manager : "";
  const addr1 = billTo.addressLine1;
  const addr2 = billTo.addressLine2;
  const phone = billTo.phoneNumber;

  // Resolve theme based on variant
  const themeKey = variant === "default" ? "standard" : variant;
  const t = TEMPLATE_THEMES[themeKey];

  if (variant === "minimal") {
    return (
      <div className="flex flex-col text-sm border-l-2 pl-4 py-1" style={{ borderColor: t.border }}>
        <h2 className="text-[10px] tracking-widest uppercase font-bold mb-3" style={{ color: t.text.muted }}>Bill To</h2>
        <div className="font-bold text-base mb-1" style={{ color: t.primary }}>{name}</div>
        <div style={{ color: t.text.muted, lineHeight: '1.625' }}>
          {contact && <div>{contact}</div>}
          {addr1 && <div>{addr1}</div>}
          {addr2 && <div>{addr2}</div>}
          {phone && <div className="mt-1">{phone}</div>}
        </div>
      </div>
    );
  }

  if (variant === "luxury") {
    return (
      <div className="flex flex-col">
        <p className="text-[10px] tracking-widest uppercase mb-2" style={{ color: t.accent }}>Prepared For</p>
        <div className="text-lg font-medium font-serif" style={{ color: t.primary }}>{name}</div>
        <div className="text-xs mt-1 font-serif italic" style={{ color: t.text.muted }}>
          {contact && <p>{contact}</p>}
          {addr1 && <p>{addr1}</p>}
          {addr2 && <p>{addr2}</p>}
          {phone && <p>{phone}</p>}
        </div>
      </div>
    );
  }

  if (variant === "spa") {
    return (
      <div className="flex-1 p-6 border rounded-xl shadow-sm" style={{ backgroundColor: t.bg.card, borderColor: t.border }}>
        <p className="text-[9px] font-bold uppercase tracking-widest mb-3" style={{ color: t.primary }}>Bill To</p>
        <p className="font-bold text-sm mb-1" style={{ color: t.text.main }}>{name}</p>
        <div className="text-xs" style={{ color: t.text.muted }}>
          {contact && <p>{contact}</p>}
          {addr1 && <p>{addr1}</p>}
          {addr2 && <p>{addr2}</p>}
          {phone && <p>{phone}</p>}
        </div>
      </div>
    );
  }

  if (variant === "studio") {
    return (
      <div className="flex flex-col">
        <p className="text-[9px] uppercase tracking-widest font-bold mb-3 border-b pb-2" style={{ color: t.secondary, borderColor: t.border }}>Bill To</p>
        <p className="font-bold text-sm mb-1" style={{ color: t.primary }}>{name}</p>
        <div className="text-xs" style={{ color: t.text.muted }}>
          {contact && <p>{contact}</p>}
          {addr1 && <p>{addr1}</p>}
          {addr2 && <p>{addr2}</p>}
          {phone && <p>{phone}</p>}
        </div>
      </div>
    );
  }

  if (variant === "botanical") {
    return (
      <div className="flex flex-col max-w-[40%] text-right items-end">
        <p className="text-[9px] uppercase tracking-widest font-bold mb-3" style={{ color: t.secondary }}>Bill To</p>
        <p className="font-bold text-sm mb-1" style={{ color: t.primary }}>{name}</p>
        <div className="text-xs font-sans leading-relaxed" style={{ color: `${t.secondary}CC` }}>
          {contact && <span>{contact}<br/></span>}
          {addr1 && <span>{addr1}<br/></span>}
          {addr2 && <span>{addr2}<br/></span>}
          {phone && <span>{phone}</span>}
        </div>
      </div>
    );
  }

  if (variant === "corporate") {
    return (
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-5 w-1 rounded-full" style={{ backgroundColor: t.secondary }} />
          <p className="text-[9px] uppercase tracking-widest font-bold" style={{ color: t.secondary }}>Bill To</p>
        </div>
        <p className="font-bold text-sm mb-1" style={{ color: t.primary }}>{name}</p>
        <div className="text-xs" style={{ color: t.text.muted }}>
          {contact && <p>{contact}</p>}
          {addr1 && <p>{addr1}</p>}
          {addr2 && <p>{addr2}</p>}
          {phone && <p>{phone}</p>}
        </div>
      </div>
    );
  }

  if (variant === "artisan") {
    return (
      <div className="border-l-4 pl-4" style={{ borderColor: t.accent }}>
        <p className="text-[9px] uppercase tracking-widest font-bold mb-2" style={{ color: t.accent }}>For</p>
        <p className="font-bold text-sm mb-1" style={{ color: t.text.main }}>{name}</p>
        <div className="text-xs" style={{ color: t.text.muted }}>
          {contact && <p>{contact}</p>}
          {addr1 && <p>{addr1}</p>}
          {addr2 && <p>{addr2}</p>}
          {phone && <p>{phone}</p>}
        </div>
      </div>
    );
  }

  // default variant (Standard)
  return (
    <div className="border rounded-xl p-4 md:p-6 lg:p-[32px] shadow-sm" style={{ backgroundColor: t.bg.header, borderColor: t.border }}>
      <div className="flex flex-col gap-2.5">
        <div className="text-xs tracking-widest uppercase font-sans mb-1" style={{ color: t.accent }}>Bill To</div>
        <div className="border bg-white rounded-2xl py-3.5 px-4 shadow-sm" style={{ borderColor: t.border }}>
          <div className="py-1.5 leading-snug">
            <strong className="font-semibold" style={{ color: t.primary }}>{name}</strong>
          </div>
          <div className="text-[13px] leading-relaxed mt-1 pt-1 border-t" style={{ color: t.text.muted, borderColor: t.border }}>
            {contact && <div className="py-1">{contact}</div>}
            {addr1 && <div className="py-1 border-t" style={{ borderColor: t.border }}>{addr1}</div>}
            {addr2 && <div className="py-1 border-t" style={{ borderColor: t.border }}>{addr2}</div>}
            {phone && <div className="py-1 border-t tabular-nums" style={{ borderColor: t.border }}>{phone}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

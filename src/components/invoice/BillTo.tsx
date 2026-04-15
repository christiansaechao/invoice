import { useSettings } from "@/store/settings.store";
import type { BillToInfo } from "@/store/settings.store";

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

  if (variant === "minimal") {
    return (
      <div className="flex flex-col text-sm border-l-2 border-slate-200 pl-4 py-1">
        <h2 className="text-[10px] tracking-widest uppercase text-slate-400 font-bold mb-3">Bill To</h2>
        <div className="font-bold text-slate-900 text-base mb-1">{name}</div>
        <div className="text-slate-500 leading-relaxed">
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
        <p className="text-[10px] tracking-widest text-[#9FA89A] uppercase mb-2">Prepared For</p>
        <div className="text-lg text-[#3A4E3E] font-medium font-serif">{name}</div>
        {contact && <p className="text-xs text-[#7A8275] mt-1 font-serif italic">{contact}</p>}
        {addr1 && <p className="text-xs text-[#7A8275]">{addr1}</p>}
        {addr2 && <p className="text-xs text-[#7A8275]">{addr2}</p>}
        {phone && <p className="text-xs text-[#7A8275]">{phone}</p>}
      </div>
    );
  }

  if (variant === "spa") {
    return (
      <div className="flex-1 bg-white p-6 border border-gray-100 rounded-xl shadow-sm">
        <p className="text-[9px] font-bold text-[#E0B876] uppercase tracking-widest mb-3">Bill To</p>
        <p className="font-bold text-slate-800 text-sm mb-1">{name}</p>
        {contact && <p className="text-xs text-slate-500">{contact}</p>}
        {addr1 && <p className="text-xs text-slate-500">{addr1}</p>}
        {addr2 && <p className="text-xs text-slate-500">{addr2}</p>}
        {phone && <p className="text-xs text-slate-500">{phone}</p>}
      </div>
    );
  }

  if (variant === "studio") {
    return (
      <div className="flex flex-col">
        <p className="text-[9px] uppercase tracking-widest font-bold text-cyan-600 mb-3 border-b border-slate-100 pb-2">Bill To</p>
        <p className="font-bold text-sm text-slate-900 mb-1">{name}</p>
        {contact && <p className="text-xs text-slate-500">{contact}</p>}
        {addr1 && <p className="text-xs text-slate-500">{addr1}</p>}
        {addr2 && <p className="text-xs text-slate-500">{addr2}</p>}
        {phone && <p className="text-xs text-slate-500">{phone}</p>}
      </div>
    );
  }

  if (variant === "botanical") {
    return (
      <div className="flex flex-col max-w-[40%] text-right items-end">
        <p className="text-[9px] uppercase tracking-widest font-bold text-green-700 mb-3">Bill To</p>
        <p className="font-bold text-sm mb-1 text-green-900">{name}</p>
        <div className="text-xs text-green-800/80 font-sans leading-relaxed">
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
          <div className="h-5 w-1 bg-[#1E4DA1] rounded-full" />
          <p className="text-[9px] uppercase tracking-widest font-bold text-[#1E4DA1]">Bill To</p>
        </div>
        <p className="font-bold text-slate-900 text-sm mb-1">{name}</p>
        {contact && <p className="text-xs text-slate-500">{contact}</p>}
        {addr1 && <p className="text-xs text-slate-500">{addr1}</p>}
        {addr2 && <p className="text-xs text-slate-500">{addr2}</p>}
        {phone && <p className="text-xs text-slate-500">{phone}</p>}
      </div>
    );
  }

  if (variant === "artisan") {
    return (
      <div className="border-l-4 border-violet-400 pl-4">
        <p className="text-[9px] uppercase tracking-widest font-bold text-violet-400 mb-2">For</p>
        <p className="font-bold text-slate-900 text-sm mb-1">{name}</p>
        {contact && <p className="text-xs text-slate-500">{contact}</p>}
        {addr1 && <p className="text-xs text-slate-500">{addr1}</p>}
        {addr2 && <p className="text-xs text-slate-500">{addr2}</p>}
        {phone && <p className="text-xs text-slate-500">{phone}</p>}
      </div>
    );
  }

  // default variant
  return (
    <div className="border border-border rounded-xl p-4 md:p-6 lg:p-[32px] bg-card shadow-sm">
      <div className="flex flex-col gap-2.5">
        <div className="text-xs tracking-widest uppercase text-muted-foreground font-sans mb-1">Bill To</div>
        <div className="border border-border bg-white rounded-2xl py-3.5 px-4 shadow-sm">
          <div className="py-1.5 leading-snug">
            <strong className="font-semibold">{name}</strong>
          </div>
          <div className="text-muted-foreground text-[13px] leading-relaxed mt-1 pt-1 border-t border-slate-200/70">
            {contact && <div className="py-1">{contact}</div>}
            {addr1 && <div className="py-1 border-t border-slate-200/70">{addr1}</div>}
            {addr2 && <div className="py-1 border-t border-slate-200/70">{addr2}</div>}
            {phone && <div className="py-1 border-t border-slate-200/70 text-muted-foreground tabular-nums">{phone}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

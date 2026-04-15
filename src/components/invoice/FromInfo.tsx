import { useUser } from "@/store/user.store";
import { useFetchProfile } from "@/api/user.api";
import { Loader2 } from "lucide-react";
import { TEMPLATE_THEMES } from "@/constants/template-themes";

export type FromInfoVariant =
  | "default"
  | "minimal"
  | "luxury"
  | "spa"
  | "studio"
  | "botanical"
  | "corporate"
  | "artisan";

interface FromInfoProps {
  variant?: FromInfoVariant;
}

export function FromInfo({ variant = "default" }: FromInfoProps) {
  const { session } = useUser();
  const { data: profile } = useFetchProfile(session?.user?.id);

  const {
    first_name,
    last_name,
    preferred_email,
    city,
    state,
    area_code,
    address,
    phone_number,
    company_name,
  } = profile ?? {};

  if (!profile) {
    return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
  }

  const fullName = `${first_name ?? ""} ${last_name ?? ""}`.trim() || "Your Name";
  const displayCompany = (company_name as string | undefined) || fullName;
  const cityStateZip = [city, state, area_code].filter(Boolean).join(", ");

  // Resolve theme based on variant
  const themeKey = variant === "default" ? "standard" : variant;
  const t = TEMPLATE_THEMES[themeKey];

  if (variant === "minimal") {
    return (
      <div className="flex flex-col text-sm">
        <p className="font-semibold" style={{ color: t.text.main }}>{displayCompany}</p>
        {address && <p style={{ color: t.text.muted, fontSize: '12px' }}>{address}</p>}
        {cityStateZip && <p style={{ color: t.text.muted, fontSize: '12px' }}>{cityStateZip}</p>}
        {phone_number && <p style={{ color: t.text.muted, fontSize: '12px' }}>{phone_number}</p>}
        {preferred_email && <p style={{ color: t.text.muted, fontSize: '12px' }}>{preferred_email}</p>}
      </div>
    );
  }

  if (variant === "luxury") {
    return (
      <div className="flex flex-col text-xs leading-relaxed font-serif" style={{ color: t.secondary }}>
        <p className="font-medium mb-1" style={{ color: t.primary }}>{fullName}</p>
        {address && <p>{address}</p>}
        {cityStateZip && <p>{cityStateZip}</p>}
        {phone_number && <p>{phone_number}</p>}
        {preferred_email && <p>{preferred_email}</p>}
      </div>
    );
  }

  if (variant === "spa") {
    return (
      <div className="flex-1 p-6 border rounded-xl shadow-sm" style={{ backgroundColor: t.bg.card, borderColor: t.border }}>
        <p className="text-[9px] font-bold uppercase tracking-widest mb-3" style={{ color: t.primary }}>From</p>
        <p className="font-bold text-sm mb-1" style={{ color: t.primary }}>{displayCompany}</p>
        {fullName !== displayCompany && <p className="text-xs" style={{ color: t.text.muted }}>{fullName}</p>}
        {address && <p className="text-xs" style={{ color: t.text.muted }}>{address}</p>}
        {cityStateZip && <p className="text-xs" style={{ color: t.text.muted }}>{cityStateZip}</p>}
        {phone_number && <p className="text-xs" style={{ color: t.text.muted }}>{phone_number}</p>}
      </div>
    );
  }

  if (variant === "studio") {
    return (
      <div className="flex flex-col">
        <p className="text-[9px] uppercase tracking-widest font-bold mb-3 border-b pb-2" style={{ color: t.secondary, borderColor: t.border }}>From</p>
        <p className="font-bold text-sm mb-1" style={{ color: t.primary }}>{displayCompany}</p>
        <div className="text-xs leading-relaxed max-w-[200px]" style={{ color: t.text.muted }}>
          {fullName !== displayCompany && <>{fullName}<br/></>}
          {address && <>{address}<br/></>}
          {cityStateZip && <>{cityStateZip}</>}
        </div>
      </div>
    );
  }

  if (variant === "botanical") {
    return (
      <div className="flex flex-col max-w-[40%]">
        <p className="text-[9px] uppercase tracking-widest font-bold mb-3" style={{ color: t.secondary }}>From</p>
        <p className="font-bold text-sm mb-1" style={{ color: t.primary }}>{fullName}</p>
        <div className="text-xs font-sans leading-relaxed" style={{ color: `${t.secondary}CC` }}>
          {displayCompany !== fullName && <>{displayCompany}<br/></>}
          {address && <>{address}<br/></>}
          {cityStateZip && <>{cityStateZip}</>}
        </div>
      </div>
    );
  }

  if (variant === "corporate") {
    return (
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-5 w-1 rounded-full" style={{ backgroundColor: t.secondary }} />
          <p className="text-[9px] uppercase tracking-widest font-bold" style={{ color: t.secondary }}>From</p>
        </div>
        <p className="font-bold text-sm mb-1" style={{ color: t.primary }}>{displayCompany}</p>
        {address && <p className="text-xs" style={{ color: t.text.muted }}>{address}</p>}
        {cityStateZip && <p className="text-xs" style={{ color: t.text.muted }}>{cityStateZip}</p>}
        {phone_number && <p className="text-xs" style={{ color: t.text.muted }}>{phone_number}</p>}
      </div>
    );
  }

  if (variant === "artisan") {
    return (
      <div className="border-l-4 pl-4" style={{ borderColor: t.accent }}>
        <p className="text-[9px] uppercase tracking-widest font-bold mb-2" style={{ color: t.primary }}>From</p>
        <p className="font-bold text-sm mb-1" style={{ color: t.text.main }}>{displayCompany}</p>
        {address && <p className="text-xs" style={{ color: t.text.muted }}>{address}</p>}
        {cityStateZip && <p className="text-xs" style={{ color: t.text.muted }}>{cityStateZip}</p>}
        {phone_number && <p className="text-xs" style={{ color: t.text.muted }}>{phone_number}</p>}
      </div>
    );
  }

  // default variant (Standard)
  return (
    <div className="border rounded-xl p-4 md:p-6 lg:p-[32px] shadow-sm flex flex-col gap-2.5" style={{ backgroundColor: t.bg.header, borderColor: t.border }}>
      <h2 className="text-xs tracking-widest uppercase font-sans mb-1" style={{ color: t.accent }}>From</h2>
      <div className="border bg-white rounded-2xl py-3.5 px-4 shadow-sm" style={{ borderColor: t.border }}>
        <div className="font-bold tracking-wide mb-1.5 capitalize" style={{ color: t.primary }}>
          {fullName}
        </div>
        <div className="text-[13px] leading-relaxed pt-1.5 border-t" style={{ color: t.text.muted, borderColor: t.border }}>
          {address && <div className="py-1">{address}</div>}
          {cityStateZip && <div className="py-1 border-t capitalize" style={{ borderColor: t.border }}>{cityStateZip}</div>}
          {phone_number && <div className="py-1 border-t tabular-nums" style={{ borderColor: t.border }}>{phone_number}</div>}
          {preferred_email && <div className="py-1 border-t" style={{ borderColor: t.border }}>{preferred_email}</div>}
        </div>
      </div>
    </div>
  );
}

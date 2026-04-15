import { useUser } from "@/store/user.store";
import { useFetchProfile } from "@/api/user.api";
import { Loader2 } from "lucide-react";

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

  if (variant === "minimal") {
    return (
      <div className="flex flex-col text-sm">
        <p className="font-semibold text-slate-900">{displayCompany}</p>
        {address && <p className="text-slate-500 text-xs">{address}</p>}
        {cityStateZip && <p className="text-slate-500 text-xs">{cityStateZip}</p>}
        {phone_number && <p className="text-slate-500 text-xs">{phone_number}</p>}
        {preferred_email && <p className="text-slate-500 text-xs">{preferred_email}</p>}
      </div>
    );
  }

  if (variant === "luxury") {
    return (
      <div className="flex flex-col text-xs text-[#5A6356] leading-relaxed font-serif">
        <p className="font-medium text-[#3A4E3E] mb-1">{fullName}</p>
        {address && <p>{address}</p>}
        {cityStateZip && <p>{cityStateZip}</p>}
        {phone_number && <p>{phone_number}</p>}
        {preferred_email && <p>{preferred_email}</p>}
      </div>
    );
  }

  if (variant === "spa") {
    return (
      <div className="flex-1 bg-white p-6 border border-gray-100 rounded-xl shadow-sm">
        <p className="text-[9px] font-bold text-[#E0B876] uppercase tracking-widest mb-3">From</p>
        <p className="font-bold text-slate-800 text-sm mb-1">{displayCompany}</p>
        {fullName !== displayCompany && <p className="text-xs text-slate-500">{fullName}</p>}
        {address && <p className="text-xs text-slate-500">{address}</p>}
        {cityStateZip && <p className="text-xs text-slate-500">{cityStateZip}</p>}
        {phone_number && <p className="text-xs text-slate-500">{phone_number}</p>}
      </div>
    );
  }

  if (variant === "studio") {
    return (
      <div className="flex flex-col">
        <p className="text-[9px] uppercase tracking-widest font-bold text-cyan-600 mb-3 border-b border-slate-100 pb-2">From</p>
        <p className="font-bold text-sm text-slate-900 mb-1">{displayCompany}</p>
        <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">
          {fullName !== displayCompany && <>{fullName}<br/></>}
          {address && <>{address}<br/></>}
          {cityStateZip && <>{cityStateZip}</>}
        </p>
      </div>
    );
  }

  if (variant === "botanical") {
    return (
      <div className="flex flex-col max-w-[40%]">
        <p className="text-[9px] uppercase tracking-widest font-bold text-green-700 mb-3">From</p>
        <p className="font-bold text-sm mb-1 text-green-900">{fullName}</p>
        <div className="text-xs text-green-800/80 font-sans leading-relaxed">
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
          <div className="h-5 w-1 bg-[#1E4DA1] rounded-full" />
          <p className="text-[9px] uppercase tracking-widest font-bold text-[#1E4DA1]">From</p>
        </div>
        <p className="font-bold text-slate-900 text-sm mb-1">{displayCompany}</p>
        {address && <p className="text-xs text-slate-500">{address}</p>}
        {cityStateZip && <p className="text-xs text-slate-500">{cityStateZip}</p>}
        {phone_number && <p className="text-xs text-slate-500">{phone_number}</p>}
      </div>
    );
  }

  if (variant === "artisan") {
    return (
      <div className="border-l-4 border-fuchsia-300 pl-4">
        <p className="text-[9px] uppercase tracking-widest font-bold text-fuchsia-400 mb-2">From</p>
        <p className="font-bold text-slate-900 text-sm mb-1">{displayCompany}</p>
        {address && <p className="text-xs text-slate-500">{address}</p>}
        {cityStateZip && <p className="text-xs text-slate-500">{cityStateZip}</p>}
        {phone_number && <p className="text-xs text-slate-500">{phone_number}</p>}
      </div>
    );
  }

  // default variant
  return (
    <div className="border border-border rounded-xl p-4 md:p-6 lg:p-[32px] bg-card shadow-sm flex flex-col gap-2.5">
      <h2 className="text-xs tracking-widest uppercase text-muted-foreground font-sans mb-1">From</h2>
      <div className="border border-border bg-white rounded-2xl py-3.5 px-4 shadow-sm">
        <div className="font-bold tracking-wide mb-1.5 capitalize text-foreground">
          {fullName}
        </div>
        <div className="text-muted-foreground text-[13px] leading-relaxed pt-1.5 border-t border-slate-200/70">
          {address && <div className="py-1">{address}</div>}
          {cityStateZip && <div className="py-1 border-t border-slate-200/70 capitalize">{cityStateZip}</div>}
          {phone_number && <div className="py-1 border-t border-slate-200/70 tabular-nums">{phone_number}</div>}
          {preferred_email && <div className="py-1 border-t border-slate-200/70">{preferred_email}</div>}
        </div>
      </div>
    </div>
  );
}

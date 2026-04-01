import { useUser } from "@/store/user.store";
import { Loader2 } from "lucide-react";

export function FromInfo() {
  const { profile } = useUser((state) => state);

  const {
    first_name,
    last_name,
    preferred_email,
    city,
    state,
    area_code,
    address,
    phone_number,
  } = profile ?? {};

  if (!profile) {
    return <Loader2 />;
  }

  return (
    <div className="border border-border rounded-xl p-4 md:p-6 lg:p-[32px] bg-card shadow-sm flex flex-col gap-2.5">
      <h2 className="text-xs tracking-widest uppercase text-muted-foreground font-sans mb-1">From</h2>
      <div className="border border-border bg-white rounded-2xl py-3.5 px-4 shadow-sm">
        <div className="font-bold tracking-wide mb-1.5 capitalize text-foreground">
          {first_name} {last_name}
        </div>
        <div className="text-muted-foreground text-[13px] leading-relaxed pt-1.5 border-t border-slate-200/70">
          <div className="py-1">{address}</div>
          <div className="py-1 border-t border-slate-200/70 capitalize">
            {city} {state}, {area_code}
          </div>
          <div className="py-1 border-t border-slate-200/70 tabular-nums">{phone_number}</div>
          <div className="py-1 border-t border-slate-200/70">{preferred_email}</div>
        </div>
      </div>
    </div>
  );
}

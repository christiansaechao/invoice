import { useUser } from "@/store/user.store";

export function Header() {
  const { profile } = useUser((state) => state);

  if (!profile) return null;

  const initials = `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}`;
  const fullName = `${profile.first_name} ${profile.last_name}`;
  const logoUrl = profile.brand_logo_url;

  return (
    <div className={`flex gap-5 items-center min-w-[260px]`}>
      {logoUrl ? (
        <div className={`w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100 shadow-sm`}>
          <img src={logoUrl} alt="Brand Logo" className="w-full h-full object-contain" />
        </div>
      ) : (
        <div className={`${1 ? "w-16 h-16 rounded-full border border-slate-200" : "w-11 h-11 rounded-xl bg-primary shadow-lg"} flex-shrink-0 flex items-center justify-center text-xl ${1 ? "text-slate-600 font-bold" : "text-white font-serif"} uppercase tracking-wider`} aria-hidden="true">
          <div>{initials}</div>
        </div>
      )}
      <div className={1 ? "text-left" : ""}>
        <h1 className={`${1 ? "text-2xl font-black" : "text-lg font-bold font-serif"} m-0 tracking-tight capitalize text-slate-900`}>{fullName}</h1>
        <p className={`mt-1 text-muted-foreground ${1 ? "text-base" : "text-xs"} leading-tight font-sans capitalize max-w-[400px]`}>
          {profile.address} • {profile.city}, {profile.state} {profile.area_code} <br className={1 ? "block" : "hidden"} />
          <span className="opacity-70">{profile.phone_number} • <span className="lowercase">{profile.preferred_email}</span></span>
        </p>
      </div>
    </div>
  );
}

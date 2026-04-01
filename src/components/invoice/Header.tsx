import { useUser } from "@/store/user.store";

export function Header() {
  const { profile } = useUser((state) => state);

  if (!profile) return null;

  const initials = `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}`;
  const fullName = `${profile.first_name} ${profile.last_name}`;

  return (
    <div className="flex gap-[14px] items-center min-w-[260px]">
      <div className="w-11 h-11 rounded-xl bg-primary shadow-lg flex items-center justify-center text-xl text-white font-serif uppercase tracking-wider" aria-hidden="true">
        <div>{initials}</div>
      </div>
      <div>
        <h1 className="text-lg m-0 font-bold tracking-wide font-serif capitalize">{fullName}</h1>
        <p className="mt-0.5 text-muted-foreground text-sm leading-tight font-sans capitalize">
          {profile.address} • {profile.city}, {profile.state} {profile.area_code} • {profile.phone_number} • <span className="lowercase">{profile.preferred_email}</span>
        </p>
      </div>
    </div>
  );
}

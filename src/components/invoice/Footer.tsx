import { useFetchProfile } from "@/api/user.api";

export function Footer() {
  const { data: profile, isPending, isError } = useFetchProfile();

  if (isPending || isError || !profile) return null;
  const fullName = `${profile.first_name} ${profile.last_name}`;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "14px",
        padding: "18px 28px 26px",
        color: "var(--foreground)",
        fontSize: "12px",
      }}
    >
      <div>
        Make checks payable to <strong className="capitalize">{fullName}</strong>
      </div>
      <div>Thank you for your business.</div>
    </div>
  );
}

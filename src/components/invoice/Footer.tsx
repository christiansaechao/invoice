import { useUser } from "@/store/user.store";

export function Footer() {
  const { profile } = useUser((state) => state);
  
  if (!profile) return null;
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

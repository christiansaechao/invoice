import { User, Mail, Shield, Calendar } from "lucide-react";
import { useUser } from "@/store/user.store";

export function UserProfileSection() {
  const { session } = useUser();
  const user = session?.user;

  // Basic formatting for dates if available
  const joinedDate = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Recently";

  return (
    <div className="flex flex-col gap-6 bg-card border border-border p-6 rounded-xl shadow-sm">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <User className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight">Account Profile</h2>
          <p className="text-sm text-muted-foreground">Your personal account information.</p>
        </div>
      </div>

      <div className="grid gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Full Name</label>
          <div className="flex items-center gap-3 p-3.5 rounded-lg bg-muted/30 border border-border group transition-colors hover:bg-muted/50">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || "No name set"}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Email Address</label>
          <div className="flex items-center gap-3 p-3.5 rounded-lg bg-muted/30 border border-border group transition-colors hover:bg-muted/50">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{user?.email || "No email available"}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Member Since</label>
            <div className="flex items-center gap-3 p-3.5 rounded-lg bg-muted/10 border border-border/50">
              <Calendar className="h-4 w-4 text-muted-foreground/60" />
              <span className="text-sm text-muted-foreground">{joinedDate}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Account ID</label>
            <div className="flex items-center gap-3 p-3.5 rounded-lg bg-muted/10 border border-border/50">
              <Shield className="h-4 w-4 text-muted-foreground/60" />
              <span className="text-sm text-muted-foreground font-mono text-[10px] truncate">{user?.id || "Unknown"}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-2 p-4 rounded-lg bg-amber-50 border border-amber-100 flex gap-3 text-amber-800">
        <div className="mt-0.5">
          <Shield className="h-4 w-4" />
        </div>
        <div className="text-xs leading-relaxed">
          <p className="font-bold mb-0.5">Account Management</p>
          <p>Profile editing is currently limited to verified business details. Contact support to update your account email.</p>
        </div>
      </div>
    </div>
  );
}

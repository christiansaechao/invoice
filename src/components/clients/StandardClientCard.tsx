export interface StandardClient {
  id: string;
  name: string;
  industry: string;
  status: "ACTIVE" | "INACTIVE" | "VIP" | "ON HOLD";
  revenue: number;
  completedInvoices: number;
  is_archived: boolean;
}

export function StandardClientCard({ 
  client, 
  onEdit,
}: { 
  client: StandardClient; 
  onEdit?: () => void;
}) {
  // Simple deterministic avatar colors
  const letters = client.name.substring(0, 2).toUpperCase();
  const colors = [
    "bg-slate-500/20 text-slate-500",
    "bg-emerald-500/20 text-emerald-500",
    "bg-violet-500/20 text-violet-500",
    "bg-rose-500/20 text-rose-500",
  ];
  const charSum = client.name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const avatarCls = colors[charSum % colors.length];

  const statusColors = {
    "ACTIVE": "bg-blue-500/10 text-blue-500",
    "INACTIVE": "bg-muted text-muted-foreground",
    "VIP": "bg-teal-500/10 text-teal-500",
    "ON HOLD": "bg-amber-500/10 text-amber-500",
  };

  return (
    <div className={`bg-card rounded-3xl p-6 border border-border shadow-sm flex flex-col h-full hover:shadow-md transition-shadow ${client.is_archived ? 'opacity-60 saturate-50' : ''}`}>
      <div className="flex justify-between items-start mb-6">
        <div className="relative group">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${avatarCls}`}>
            {letters}
          </div>
          {onEdit && (
            <button 
              onClick={onEdit}
              className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground p-1 rounded-md shadow-lg hover:scale-110 transition-transform active:scale-95"
              title="Edit Profile"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
            </button>
          )}
        </div>
          {client.is_archived ? (
            <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest bg-muted text-muted-foreground border border-border">
              ARCHIVED
            </span>
          ) : (
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest ${statusColors[client.status]}`}>
              {client.status}
            </span>
          )}
        </div>

      <div className="mb-6 flex-1">
        <h3 className="text-xl font-bold tracking-tight text-foreground">{client.name}</h3>
        <p className="text-sm text-muted-foreground font-medium">{client.industry}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-1">Revenue</p>
          <p className="font-bold text-foreground">
            {(client.revenue / 100).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-1">Invoices</p>
          <p className="font-bold text-foreground">{client.completedInvoices} Units</p>
        </div>
      </div>

    </div>
  );
}

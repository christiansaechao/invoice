import { Button } from "@/components/ui/button";

export interface StandardClient {
  id: string;
  name: string;
  industry: string;
  status: "ACTIVE" | "INACTIVE" | "VIP" | "ON HOLD";
  revenue: number;
  collabs: number;
}

export function StandardClientCard({ client }: { client: StandardClient }) {
  // Simple deterministic avatar colors
  const letters = client.name.substring(0, 2).toUpperCase();
  const colors = [
    "bg-slate-900 text-white",
    "bg-emerald-900 text-emerald-100",
    "bg-violet-900 text-violet-100",
    "bg-rose-900 text-rose-100",
  ];
  const charSum = client.name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const avatarCls = colors[charSum % colors.length];

  const statusColors = {
    "ACTIVE": "bg-slate-200 text-slate-700",
    "INACTIVE": "bg-slate-200/50 text-slate-500",
    "VIP": "bg-teal-300 text-teal-900",
    "ON HOLD": "bg-slate-200 text-slate-700",
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-border shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-6">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${avatarCls}`}>
          {letters}
        </div>
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest ${statusColors[client.status]}`}>
          {client.status}
        </span>
      </div>

      <div className="mb-6 flex-1">
        <h3 className="text-xl font-bold tracking-tight text-slate-900">{client.name}</h3>
        <p className="text-sm text-slate-500 font-medium">{client.industry}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">Revenue</p>
          <p className="font-bold text-slate-900">
            {client.revenue.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">Collabs</p>
          <p className="font-bold text-slate-900">{client.collabs} Units</p>
        </div>
      </div>

      <Button variant="outline" className="w-full rounded-xl text-primary font-semibold hover:bg-primary/5 transition-colors border-slate-200">
        View Details
      </Button>
    </div>
  );
}

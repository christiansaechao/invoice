import { TrendingUp, Clock, AlertTriangle } from "lucide-react";

interface EarningsHeroProps {
  totalRevenue: number;
  paidCount: number;
  pendingCount: number;
  overdueCount: number;
}

export function EarningsHero({
  totalRevenue,
  paidCount,
  pendingCount,
  overdueCount,
}: EarningsHeroProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
      {/* Left: Revenue figure */}
      <div className="flex flex-col gap-1">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
          Earnings This Month
        </p>
        <div className="flex items-end gap-4 flex-wrap">
          <span className="text-5xl font-extrabold tabular-nums text-primary leading-none">
            {totalRevenue.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
          <div className="flex items-center gap-3 pb-1">
            <span
              className="flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full text-white"
              style={{ background: "#03DAC6" }}
            >
              <TrendingUp className="h-3 w-3" /> Lifetime Earned
            </span>
            <span className="text-sm text-muted-foreground">
              {paidCount} Paid Invoices
            </span>
          </div>
        </div>
      </div>

      {/* Right: Stat chips */}
      <div className="flex gap-3 flex-shrink-0">
        {/* Pending */}
        <div className="relative bg-white rounded-2xl border-l-4 border-primary shadow-sm px-5 py-4 min-w-[110px]">
          <Clock className="h-5 w-5 text-primary mb-2" />
          <div className="text-2xl font-extrabold text-foreground tabular-nums">
            {String(pendingCount).padStart(2, "0")}
          </div>
          <div className="text-[9px] font-bold tracking-widest uppercase text-muted-foreground leading-tight">
            Pending
            <br />
            Invoices
          </div>
        </div>

        {/* Overdue */}
        <div
          className="relative rounded-2xl shadow-sm px-5 py-4 min-w-[110px]"
          style={{ background: "#ffe4ed" }}
        >
          <AlertTriangle
            className="h-5 w-5 mb-2"
            style={{ color: "#FF0266" }}
          />
          <div
            className="text-2xl font-extrabold tabular-nums"
            style={{ color: "#FF0266" }}
          >
            {String(overdueCount).padStart(2, "0")}
          </div>
          <div
            className="text-[9px] font-bold tracking-widest uppercase leading-tight"
            style={{ color: "#FF0266", opacity: 0.7 }}
          >
            Overdue
            <br />
            Alerts
          </div>
        </div>
      </div>
    </div>
  );
}

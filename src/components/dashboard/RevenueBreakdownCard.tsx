import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { usePlanLimits } from "@/hooks/usePlanLimits";

interface BreakdownItem {
  label: string;
  value: number;
  pct: number;
  color: string;
}

interface RevenueBreakdownCardProps {
  breakdown: BreakdownItem[];
  clientCount: number;
}

export function RevenueBreakdownCard({ breakdown, clientCount }: RevenueBreakdownCardProps) {
  const { tier, activeClientCount, limits } = usePlanLimits();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Revenue Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {breakdown.map((item) => (
          <div key={item.label} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold tracking-widest uppercase text-muted-foreground">
                {item.label}
              </span>
              <span className="text-[10px] font-semibold text-muted-foreground">
                {item.pct}% of total
              </span>
            </div>
            <span className="text-lg font-extrabold tabular-nums text-foreground">
              {item.value.toLocaleString("en-US", { style: "currency", currency: "USD" })}
            </span>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${item.pct}%`, background: item.color }}
              />
            </div>
          </div>
        ))}

        <div className="pt-2 border-t border-border flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Brands</span>
            <span className="font-bold text-foreground">{clientCount}</span>
          </div>
          {tier === "starter" && (
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-muted-foreground uppercase tracking-widest font-bold">Active Slots</span>
              <span className={`font-bold ${activeClientCount >= limits.activeClients ? 'text-amber-500' : 'text-primary'}`}>
                {activeClientCount} / {limits.activeClients}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

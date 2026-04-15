import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";

interface RevenueChartProps {
  chartData: { date: string; revenue: number }[];
  chartGrouping: "day" | "month";
  onGroupingChange: (g: "day" | "month") => void;
}

const chartConfig = { revenue: { label: "Earned Revenue", color: "#6200EE" } };

export function RevenueChart({ chartData, chartGrouping, onGroupingChange }: RevenueChartProps) {
  return (
    <Card className="min-w-0">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Earned Revenue</CardTitle>
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          {(["day", "month"] as const).map((g) => (
            <button
              key={g}
              onClick={() => onGroupingChange(g)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                chartGrouping === g
                  ? "bg-white shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {g === "day" ? "Daily" : "Monthly"}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[260px] w-full min-w-0">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6200EE" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6200EE" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={70}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                tickFormatter={(v) => `$${v}`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#6200EE"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#fillRevenue)"
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-[260px] text-muted-foreground flex-col gap-2">
            <p>No revenue data yet.</p>
            <p className="text-sm">Complete an invoice to see earnings here!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

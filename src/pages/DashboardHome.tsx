import { useEffect, useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { fetchInvoicesWithTotals, fetchClients } from "@/services/invoice.services";
import type { InvoicesWithTotals } from "@/types/invoice.types";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import { Loader2 } from "lucide-react";
import { QuickEditInvoice } from "@/components/invoice/QuickEditInvoice";

export function DashboardHome() {
  const [invoices, setInvoices] = useState<InvoicesWithTotals[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const [invData, clientData] = await Promise.all([
          fetchInvoicesWithTotals(),
          fetchClients(),
        ]);
        setInvoices(invData || []);
        setClients(clientData || []);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [refreshTrigger]);

  // Aggregations
  const totalRevenue = useMemo(() => {
    return invoices
      .filter((inv) => inv.completed)
      .reduce((sum, inv) => sum + (inv.total_amount_owed || 0), 0);
  }, [invoices]);

  const pendingInvoices = useMemo(() => {
    return invoices.filter((inv) => !inv.completed);
  }, [invoices]);

  const pendingAmount = useMemo(() => {
    return pendingInvoices.reduce((sum, inv) => sum + (inv.total_amount_owed || 0), 0);
  }, [pendingInvoices]);

  const chartData = useMemo(() => {
    // Group invoices by month-year
    const groups: Record<string, number> = {};
    
    // Sort ascending by date
    const sorted = [...invoices]
      .filter(inv => inv.completed)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    
    sorted.forEach((inv) => {
      const date = new Date(inv.created_at);
      const monthYear = date.toLocaleDateString("default", { month: "short", year: "numeric" });
      if (!groups[monthYear]) {
        groups[monthYear] = 0;
      }
      groups[monthYear] += inv.total_amount_owed || 0;
    });

    return Object.entries(groups).map(([date, revenue]) => ({
      date,
      revenue,
    }));
  }, [invoices]);

  const chartConfig = {
    revenue: {
      label: "Earned Revenue",
      color: "hsl(var(--primary))",
    },
  };

  if (isLoading && !invoices.length) {
    return (
      <div className="flex items-center justify-center h-full min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-8 h-full">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Left Column: Stats & Charts */}
        <div className="xl:col-span-2 flex flex-col gap-6 w-full min-w-0">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalRevenue.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                </div>
                <p className="text-xs text-muted-foreground">
                  Lifetime earnings from completed invoices
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Invoices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingInvoices.length}</div>
                <p className="text-xs text-muted-foreground">
                  Amounting to {pendingAmount.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clients.length}</div>
                <p className="text-xs text-muted-foreground">Total saved contacts</p>
              </CardContent>
            </Card>
          </div>

          <Card className="min-w-0">
            <CardHeader>
              <CardTitle>Earned Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-[350px] w-full min-w-0">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      tickLine={false} 
                      axisLine={false} 
                      tickMargin={10} 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                    />
                    <YAxis 
                      tickLine={false} 
                      axisLine={false} 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      tickFormatter={(value) => `$${value}`}
                      width={80}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="var(--color-revenue)"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#fillRevenue)"
                    />
                  </AreaChart>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-[350px] text-muted-foreground flex-col gap-2">
                  <p>No revenue data available to display.</p>
                  <p className="text-sm">Complete an invoice to see your earnings here!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Quick Editor */}
        <div className="xl:col-span-1 w-full min-w-0 sticky top-4">
          <QuickEditInvoice 
            invoices={invoices} 
            onSaveSuccess={() => setRefreshTrigger(t => t + 1)} 
          />
        </div>
      </div>
    </div>
  );
}

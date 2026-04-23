import { useEffect, useState, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { useFetchInvoicesWithTotals } from "@/api/invoice.api";
import { useFetchClients } from "@/api/client.api";
import { useFetchProfile } from "@/api/user.api";
import type { InvoicesWithTotals } from "@/types/invoice.types";

import { EarningsHero } from "@/components/dashboard/EarningsHero";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { RecentInvoicesCard } from "@/components/dashboard/RecentInvoicesCard";
import { RevenueBreakdownCard } from "@/components/dashboard/RevenueBreakdownCard";
import { NextCollaborationCard } from "@/components/dashboard/NextCollaborationCard";
import { QuickEditInvoice } from "@/components/invoice/QuickEditInvoice";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildBreakdown(paidTotal: number, pendingTotal: number) {
  const grand = paidTotal + pendingTotal || 1;
  return [
    {
      label: "PAID INVOICES",
      value: paidTotal,
      pct: Math.round((paidTotal / grand) * 100),
      color: "#6200EE",
    },
    {
      label: "PENDING INVOICES",
      value: pendingTotal,
      pct: Math.round((pendingTotal / grand) * 100),
      color: "#03DAC6",
    },
  ];
}

function buildChartData(
  invoices: InvoicesWithTotals[],
  grouping: "day" | "month",
) {
  const groups: Record<string, number> = {};
  const sorted = [...invoices]
    .filter((i) => i.status === "paid")
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );

  sorted.forEach((inv) => {
    const date = new Date(inv.created_at);
    const key =
      grouping === "day"
        ? date.toLocaleDateString("default", { month: "short", day: "numeric" })
        : date.toLocaleDateString("default", {
            month: "short",
            year: "numeric",
          });
    if (!groups[key]) groups[key] = 0;
    groups[key] += (inv.total_amount_owed || 0) / 100;
  });

  return Object.entries(groups).map(([date, revenue]) => ({ date, revenue }));
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function DashboardHome() {
  const { data: invoices = [], isLoading: isLoadingInvoices } = useFetchInvoicesWithTotals();
  const { data: clients = [], isLoading: isLoadingClients } = useFetchClients();
  const isLoading = isLoadingInvoices || isLoadingClients;
  
  const [chartGrouping, setChartGrouping] = useState<"day" | "month">("day");

  // ── Derived data ──────────────────────────────────────────────────────────
  const paidInvoices = useMemo(
    () => invoices.filter((i) => i.status === "paid"),
    [invoices],
  );

  const pendingInvoices = useMemo(
    () => invoices.filter((i) => i.status === "pending"),
    [invoices],
  );
  const overdueInvoices = useMemo(
    () => invoices.filter((i) => i.status === "overdue"),
    [invoices],
  );

  const totalRevenue = useMemo(
    () =>
      paidInvoices.reduce((s, i) => s + (i.total_amount_owed || 0) / 100, 0),
    [paidInvoices],
  );

  console.log(totalRevenue);

  const pendingAmount = useMemo(
    () =>
      pendingInvoices.reduce((s, i) => s + (i.total_amount_owed || 0) / 100, 0),
    [pendingInvoices],
  );

  const recentInvoices = useMemo(
    () =>
      [...invoices]
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
        .slice(0, 4),
    [invoices],
  );

  const chartData = useMemo(
    () => buildChartData(invoices, chartGrouping),
    [invoices, chartGrouping],
  );

  const breakdown = useMemo(
    () => buildBreakdown(totalRevenue, pendingAmount),
    [totalRevenue, pendingAmount],
  );

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isLoading && !invoices.length) {
    return (
      <div className="flex items-center justify-center h-full min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-8 h-full">
      <EarningsHero
        totalRevenue={totalRevenue}
        paidCount={paidInvoices.length}
        pendingCount={pendingInvoices.length}
        overdueCount={overdueInvoices.length}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Left: chart + recent invoices */}
        <div className="xl:col-span-2 flex flex-col gap-6 min-w-0">
          <RevenueChart
            chartData={chartData}
            chartGrouping={chartGrouping}
            onGroupingChange={setChartGrouping}
          />
          <RecentInvoicesCard invoices={recentInvoices} isLoading={isLoading} />
          <NextCollaborationCard />
        </div>

        {/* Right: sidebar cards */}
        <div className="xl:col-span-1 flex flex-col gap-5 min-w-0">
          <QuickEditInvoice invoices={invoices} />
          <RevenueBreakdownCard
            breakdown={breakdown}
            clientCount={clients.length}
          />
        </div>
      </div>
    </div>
  );
}

import { useMemo } from "react";
import { useFetchClients } from "@/api/client.api";
import { useFetchInvoicesWithTotals } from "@/api/invoice.api";
import { useCurrentSubscription } from "@/api/subscription.api";
import { SUBSCRIPTION_LIMITS } from "@/constants/limits";
import type { SubscriptionTier } from "@/constants/pricing";

export function usePlanLimits() {
  const { data: subscription } = useCurrentSubscription();
  const { data: clients } = useFetchClients();
  const { data: invoices } = useFetchInvoicesWithTotals();

  const tier = (subscription?.tier as SubscriptionTier) || "starter";
  const limits = SUBSCRIPTION_LIMITS[tier];

  const stats = useMemo(() => {
    if (!clients || !invoices) return { activeClientCount: 0, monthlyInvoiceCount: 0 };

    // 1. Active Clients: any client NOT ARCHIVED with an outstanding invoice or recent work
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeClientIds = new Set<string>();
    
    // 1. Every unarchived client always occupies a slot
    (clients || []).forEach(c => {
      if (!c.is_archived) {
        activeClientIds.add(c.id);
      }
    });

    // 2. Archived clients STILL occupy a slot if they have debt or recent activity
    invoices.forEach(inv => {
      if (!inv.client_id) return;

      const invDate = new Date(inv.created_at);
      const isRecent = invDate >= thirtyDaysAgo;
      const isOutstanding = inv.status !== "paid";
      
      if (isRecent || isOutstanding) {
        activeClientIds.add(inv.client_id);
      }
    });

    const activeClientCount = activeClientIds.size;

    // 2. Monthly Invoices: count invoices created in the current calendar month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthlyInvoiceCount = invoices.filter(inv => {
      const invDate = new Date(inv.created_at);
      return invDate >= startOfMonth;
    }).length;

    return { activeClientCount, monthlyInvoiceCount };
  }, [clients, invoices]);

  const canAddClient = limits.activeClients === 999999 || stats.activeClientCount < limits.activeClients;
  const canCreateInvoice = limits.monthlyInvoices === 999999 || stats.monthlyInvoiceCount < limits.monthlyInvoices;

  return {
    tier,
    limits,
    ...stats,
    canAddClient,
    canCreateInvoice,
  };
}

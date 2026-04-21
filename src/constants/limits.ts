import type { SubscriptionTier } from "./pricing";

export interface PlanLimits {
  activeClients: number;
  monthlyInvoices: number;
}

export const SUBSCRIPTION_LIMITS: Record<SubscriptionTier, PlanLimits> = {
  starter: {
    activeClients: 3,
    monthlyInvoices: 5,
  },
  pro: {
    activeClients: 999999, // Practically unlimited
    monthlyInvoices: 999999,
  },
  teams: {
    activeClients: 999999,
    monthlyInvoices: 999999,
  },
};

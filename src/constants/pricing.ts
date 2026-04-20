
// ─── Brand ───────────────────────────────────────────────────────────────────
export const BRAND_NAME = "Receipts";
export const BRAND_TAGLINE = "Precision Fluidity for Creators. The modern operating system for creative capital.";

// ─── Shared Types ─────────────────────────────────────────────────────────────
export type SubscriptionTier = "starter" | "pro" | "teams";
export type BillingInterval = "month" | "year";

export interface UserSubscription {
  tier: SubscriptionTier;
  status: string;
  billing_interval: BillingInterval;
  cancel_at_period_end: boolean;
  current_period_end?: string;
  magic_credits?: number;
  credits_last_reset?: string | null;
  stripe_customer_id?: string | null;
}

// ─── Constants & Limits ────────────────────────────────────────────────────────
export const MAGIC_CREDIT_LIMITS: Record<SubscriptionTier, number> = {
  starter: 3,
  pro: 50,
  teams: 200,
};

export function getDaysUntilReset(creditsLastReset?: string | null): number {
  if (!creditsLastReset) return 0;
  try {
    const lastReset = new Date(creditsLastReset);
    const now = new Date();
    // In db cron: "credits_last_reset <= NOW() - INTERVAL '30 days'"
    // So the reset happens precisely 30 days after last_reset.
    const resetDate = new Date(lastReset.getTime() + 30 * 24 * 60 * 60 * 1000);
    const diffDays = Math.ceil((resetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  } catch (e) {
    return 0;
  }
}

// ─── Plans ────────────────────────────────────────────────────────────────────
export type Plan = {
  id: SubscriptionTier;
  tier: string;
  name: string;
  price: {
    month: number;
    year: number;
  };
  description: string;
  cta: string;
  ctaHref: string;
  featured: boolean;
  features: string[];
};

export const FEATURES_STARTER = [
  "Up to 3 active clients",
  "5 invoices per month",
  "3 Magic AI generations",
  "Standard invoice templates",
  "Basic dashboard analytics",
];

export const FEATURES_PRO = [
  "Unlimited clients",
  "Unlimited invoices",
  "50 Magic AI generations / month",
  "All 8 premium invoice templates",
  "Advanced dashboard & analytics",
  "Custom hourly rates",
  "Remove Receipts watermark",
  "Priority email support",
];

export const PRICES = {
  pro: {
    month: 19,
    year: 180,
  },
} as const;

export const PRICE_IDS_STRIPE = {
  pro: {
    month: import.meta.env.VITE_STRIPE_PRO_MONTHLY_PRICE_ID as string,
    year: import.meta.env.VITE_STRIPE_PRO_ANNUAL_PRICE_ID as string,
  },
} as const;

export const TIER_LABELS: Record<SubscriptionTier, string> = {
  starter: "Starter (Free)",
  pro: "Pro",
  teams: "Teams",
};

export const PLANS: Plan[] = [
  {
    id: "starter",
    tier: "BASIC TIER",
    name: "Starter",
    price: { month: 0, year: 0 },
    description: "Perfect for freelancers just starting their journey.",
    cta: "Get Started for Free",
    ctaHref: "/sign-up",
    featured: false,
    features: FEATURES_STARTER,
  },
  {
    id: "pro",
    tier: "PROFESSIONAL TIER",
    name: "Pro",
    price: PRICES.pro,
    description: "Everything you need to manage a growing business.",
    cta: "Start 14-Day Free Trial",
    ctaHref: "/sign-up?plan=pro",
    featured: true,
    features: FEATURES_PRO,
  },
];

// ─── Comparison table ─────────────────────────────────────────────────────────
export type ComparisonRow = {
  feature: string;
  starter: string | boolean;
  pro: string | boolean;
};

export const COMPARISON_ROWS: ComparisonRow[] = [
  { feature: "Active Clients",    starter: "3",         pro: "Unlimited" },
  { feature: "Monthly Invoices",  starter: "5",         pro: "Unlimited" },
  { feature: "Magic AI Credits",  starter: "3",         pro: "50/mo" },
  { feature: "Custom Rates",      starter: false,       pro: true },
  { feature: "White-labeling",    starter: false,       pro: true },
  { feature: "Analytics",         starter: "Basic",     pro: "Advanced" },
];

// ─── FAQ ──────────────────────────────────────────────────────────────────────
export type FaqItem = {
  q: string;
  a: string;
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Can I cancel my subscription?",
    a: "Yes, you can cancel your Pro plan at any time. Your account will remain active until the end of the current billing cycle, after which it will revert to the Starter plan.",
  },
  {
    q: "How do the client limits work?",
    a: "The Starter plan allows for 3 active clients. An active client is any client with an outstanding invoice or one you've worked with in the last 30 days. You can archive clients to free up slots.",
  },
  {
    q: "What is the client payment experience like?",
    a: "Clients receive a clean, professional link to a secure portal where they can view the invoice and pay via card or bank transfer instantly. No login required for them.",
  },
];

// ─── CTA section ──────────────────────────────────────────────────────────────
export const CTA_HEADLINE = "Stop chasing payments and start tracking your time.";
export const CTA_SUBTEXT  = "Create your free account in 30 seconds. No credit card required to get started.";
export const CTA_PRIMARY  = "Create Free Account";
export const CTA_SECONDARY = "Speak to Sales";
export const SOCIAL_PROOF = "Trusted by 5,000+ independent contractors and leads.";

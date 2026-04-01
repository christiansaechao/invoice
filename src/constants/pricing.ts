

// ─── Brand ───────────────────────────────────────────────────────────────────
export const BRAND_NAME = "Pay That Man";
export const BRAND_TAGLINE = "The definitive invoicing partner for professional services.";

// ─── Plans ────────────────────────────────────────────────────────────────────
export type Plan = {
  id: string;
  tier: string;
  name: string;
  price: string;
  period: string;
  description: string;
  cta: string;
  ctaHref: string;
  featured: boolean;
  features: string[];
};

export const PLANS: Plan[] = [
  {
    id: "starter",
    tier: "BASIC TIER",
    name: "Starter",
    price: "$0",
    period: "/month",
    description: "Perfect for freelancers just starting their journey.",
    cta: "Get Started for Free",
    ctaHref: "/sign-up",
    featured: false,
    features: [
      "Up to 3 active clients",
      "5 invoices per month",
      "Basic time tracking",
      "Standard exports",
    ],
  },
  {
    id: "pro",
    tier: "PROFESSIONAL TIER",
    name: "Pro",
    price: "$12",
    period: "/month",
    description: "Everything you need to manage a growing business.",
    cta: "Start 14-Day Free Trial",
    ctaHref: "/sign-up?plan=pro",
    featured: true,
    features: [
      "Unlimited clients",
      "Unlimited invoices",
      "Custom default hourly rates",
      "Remove watermark",
      "Advanced dashboard & analytics",
    ],
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
  { feature: "Time Tracking",     starter: true,        pro: true },
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
export const SOCIAL_PROOF = "Trusted by 50,000+ independent contractors and leads.";

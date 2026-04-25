/**
 * lib/billing.ts — Canonical billing computation module
 *
 * All monetary math operates in CENTS (sub-units). This module is intentionally
 * framework-agnostic — no React, Zustand, or Supabase imports.
 *
 * @readonly Totals are computed at write-time. Renderers must not recalculate.
 */

import type { Row } from "@/types/entries.types";

// ─── Types ───────────────────────────────────────────────────────────────────

export type DiscountInput = {
  type: "flat" | "percent";
  /** cents if flat, raw percent number if percent (e.g. 10 = 10%) */
  value: number;
};

export type TotalsInput = {
  lineAmountsCents: number[];
  discount?: DiscountInput;
  /** basis points — e.g. 825 = 8.25% */
  taxRateBps?: number;
};

export type ComputedTotals = {
  subtotalCents: number;
  discountCents: number;
  taxableCents: number;
  taxCents: number;
  totalCents: number;
};

// ─── Core computation ────────────────────────────────────────────────────────

/**
 * Computes invoice totals from line item amounts, discount, and tax.
 *
 * Formula: total = (subtotal - discount) + tax
 * Tax is applied AFTER discount (standard US/CA/EU).
 */
export function computeInvoiceTotals(input: TotalsInput): ComputedTotals {
  const subtotalCents = input.lineAmountsCents.reduce((a, b) => a + b, 0);

  let discountCents = 0;
  if (input.discount) {
    if (input.discount.type === "flat") {
      discountCents = input.discount.value;
    } else {
      discountCents = Math.round(
        subtotalCents * (input.discount.value / 100),
      );
    }
  }

  const taxableCents = Math.max(subtotalCents - discountCents, 0);
  const taxRateBps = input.taxRateBps ?? 0;
  const taxCents = Math.round(taxableCents * (taxRateBps / 10000));
  const totalCents = taxableCents + taxCents;

  return { subtotalCents, discountCents, taxableCents, taxCents, totalCents };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Converts UI Row[] (dollar strings) to an array of cent integers
 * suitable for passing to computeInvoiceTotals.
 */
export function rowsToCentAmounts(rows: Row[]): number[] {
  return rows.map((row) => {
    const dollars = parseFloat(row.amount) || 0;
    return Math.round(dollars * 100);
  });
}

/**
 * Convenience wrapper: takes UI-layer inputs (dollar-string rows + store values)
 * and returns computed totals in BOTH cents and dollars.
 */
export function computeTotalsFromRows(
  rows: Row[],
  discountMode: "flat" | "percent",
  discountValue: number,
  taxRateBps: number = 0,
): ComputedTotals & {
  subtotal: number;
  discountAmt: number;
  tax: number;
  total: number;
} {
  const centAmounts = rowsToCentAmounts(rows);
  const discountValueCents =
    discountMode === "flat" ? Math.round(discountValue * 100) : discountValue;

  const totals = computeInvoiceTotals({
    lineAmountsCents: centAmounts,
    discount: { type: discountMode, value: discountValueCents },
    taxRateBps,
  });

  return {
    ...totals,
    // Dollar values for UI display / preview
    subtotal: totals.subtotalCents / 100,
    discountAmt: totals.discountCents / 100,
    tax: totals.taxCents / 100,
    total: totals.totalCents / 100,
  };
}

// ─── Validation ──────────────────────────────────────────────────────────────

/**
 * Pre-save assertion: verifies the payload totals match a fresh computation
 * from the line items. Throws if there's a mismatch.
 */
export function assertTotalsConsistent(
  payload: {
    subtotal: number;
    total_amount: number;
    tax_amount: number;
    tax_rate: number;
    discount_value: number;
    discount_type: "flat" | "percent";
  },
  lineAmountsCents: number[],
): void {
  const expected = computeInvoiceTotals({
    lineAmountsCents,
    discount: { type: payload.discount_type, value: payload.discount_value },
    taxRateBps: payload.tax_rate,
  });

  if (payload.subtotal !== expected.subtotalCents) {
    throw new Error(
      `Subtotal mismatch: got ${payload.subtotal}, expected ${expected.subtotalCents}`,
    );
  }
  if (payload.total_amount !== expected.totalCents) {
    throw new Error(
      `Total mismatch: got ${payload.total_amount}, expected ${expected.totalCents}`,
    );
  }
}

// ─── Change classification (for Save & Resend logic) ─────────────────────────

/** Fields that affect what the client owes — changes require resend */
const FINANCIAL_FIELDS = new Set([
  "subtotal",
  "total_amount",
  "discount_type",
  "discount_value",
  "tax_rate",
  "tax_amount",
  "currency",
  "due_date",
]);

/**
 * Compares two invoice snapshots and returns true if any financial field changed.
 * Used to determine whether the "Save & Resend" button should appear.
 */
export function isFinancialChange(
  before: Record<string, unknown>,
  after: Record<string, unknown>,
): boolean {
  for (const field of FINANCIAL_FIELDS) {
    if (before[field] !== after[field]) return true;
  }

  // Also check line item changes — compare serialized entries
  const beforeEntries = JSON.stringify(before.entries ?? []);
  const afterEntries = JSON.stringify(after.entries ?? []);
  if (beforeEntries !== afterEntries) return true;

  return false;
}

// ─── Balance computation ─────────────────────────────────────────────────────

export type PaymentEvent = {
  amountCents: number; // positive = payment, negative = refund
  status: string;
};

/**
 * Computes the balance due from the invoice total and an array of payment events.
 * Only counts payments with status 'completed'.
 * Can be used client-side without a DB call when payment data is already loaded.
 */
export function computeBalanceDue(
  totalAmountCents: number,
  payments: PaymentEvent[],
): {
  totalPaidCents: number;
  totalRefundedCents: number;
  balanceDueCents: number;
} {
  let totalPaidCents = 0;
  let totalRefundedCents = 0;

  for (const p of payments) {
    if (p.status !== "completed") continue;
    if (p.amountCents > 0) {
      totalPaidCents += p.amountCents;
    } else {
      totalRefundedCents += Math.abs(p.amountCents);
    }
  }

  const balanceDueCents = totalAmountCents - totalPaidCents + totalRefundedCents;

  return { totalPaidCents, totalRefundedCents, balanceDueCents };
}

import { describe, it, expect } from "vitest";
import {
  computeInvoiceTotals,
  rowsToCentAmounts,
  computeTotalsFromRows,
  assertTotalsConsistent,
  isFinancialChange,
  computeBalanceDue,
} from "@/lib/billing";
import type { Row } from "@/types/entries.types";

describe("computeInvoiceTotals", () => {
  it("computes subtotal from line items", () => {
    const result = computeInvoiceTotals({
      lineAmountsCents: [5000, 3000, 2000], // $50 + $30 + $20
    });
    expect(result.subtotalCents).toBe(10000);
    expect(result.totalCents).toBe(10000);
    expect(result.discountCents).toBe(0);
    expect(result.taxCents).toBe(0);
  });

  it("applies flat discount correctly", () => {
    const result = computeInvoiceTotals({
      lineAmountsCents: [10000], // $100
      discount: { type: "flat", value: 1500 }, // $15 flat
    });
    expect(result.subtotalCents).toBe(10000);
    expect(result.discountCents).toBe(1500);
    expect(result.totalCents).toBe(8500); // $85
  });

  it("applies percent discount correctly", () => {
    const result = computeInvoiceTotals({
      lineAmountsCents: [10000], // $100
      discount: { type: "percent", value: 20 }, // 20%
    });
    expect(result.subtotalCents).toBe(10000);
    expect(result.discountCents).toBe(2000);
    expect(result.totalCents).toBe(8000); // $80
  });

  it("applies tax AFTER discount", () => {
    const result = computeInvoiceTotals({
      lineAmountsCents: [50000], // $500
      discount: { type: "flat", value: 5000 }, // $50 flat discount
      taxRateBps: 825, // 8.25%
    });
    expect(result.subtotalCents).toBe(50000);
    expect(result.discountCents).toBe(5000);
    expect(result.taxableCents).toBe(45000); // $450 after discount
    expect(result.taxCents).toBe(3713); // $450 × 8.25% = $37.125 → $37.13
    expect(result.totalCents).toBe(48713); // $450 + $37.13 = $487.13
  });

  it("handles zero line items", () => {
    const result = computeInvoiceTotals({ lineAmountsCents: [] });
    expect(result.subtotalCents).toBe(0);
    expect(result.totalCents).toBe(0);
  });

  it("handles 100% discount", () => {
    const result = computeInvoiceTotals({
      lineAmountsCents: [10000],
      discount: { type: "percent", value: 100 },
    });
    expect(result.totalCents).toBe(0);
    expect(result.taxCents).toBe(0);
  });

  it("prevents negative taxable amount", () => {
    const result = computeInvoiceTotals({
      lineAmountsCents: [5000], // $50
      discount: { type: "flat", value: 10000 }, // $100 discount on $50
    });
    expect(result.taxableCents).toBe(0); // clamped to 0, not negative
    expect(result.totalCents).toBe(0);
  });
});

describe("rowsToCentAmounts", () => {
  it("converts dollar-string rows to cent integers", () => {
    const rows: Row[] = [
      { service_date: "", item_name: "", description: "", quantity: "2", unit_price: "45.00", amount: "90.00", category: null },
      { service_date: "", item_name: "", description: "", quantity: "1", unit_price: "35.00", amount: "35.00", category: null },
    ];
    expect(rowsToCentAmounts(rows)).toEqual([9000, 3500]);
  });

  it("handles empty amount strings", () => {
    const rows: Row[] = [
      { service_date: "", item_name: "", description: "", quantity: "", unit_price: "", amount: "", category: null },
    ];
    expect(rowsToCentAmounts(rows)).toEqual([0]);
  });
});

describe("computeTotalsFromRows", () => {
  it("returns both cents and dollar values", () => {
    const rows: Row[] = [
      { service_date: "", item_name: "", description: "", quantity: "1", unit_price: "100.00", amount: "100.00", category: null },
    ];
    const result = computeTotalsFromRows(rows, "flat", 10, 825);
    // $100 - $10 discount = $90 taxable, tax = $90 × 8.25% = $7.43
    expect(result.subtotalCents).toBe(10000);
    expect(result.discountCents).toBe(1000);
    expect(result.taxCents).toBe(743); // Math.round(9000 * 825 / 10000) = 743
    expect(result.totalCents).toBe(9743);
    // Dollar values
    expect(result.subtotal).toBe(100);
    expect(result.discountAmt).toBe(10);
    expect(result.tax).toBeCloseTo(7.43);
    expect(result.total).toBeCloseTo(97.43);
  });
});

describe("assertTotalsConsistent", () => {
  it("does not throw for correct totals", () => {
    expect(() =>
      assertTotalsConsistent(
        { subtotal: 10000, total_amount: 8500, tax_amount: 0, tax_rate: 0, discount_value: 1500, discount_type: "flat" },
        [10000],
      ),
    ).not.toThrow();
  });

  it("throws for mismatched subtotal", () => {
    expect(() =>
      assertTotalsConsistent(
        { subtotal: 9999, total_amount: 8499, tax_amount: 0, tax_rate: 0, discount_value: 1500, discount_type: "flat" },
        [10000],
      ),
    ).toThrow("Subtotal mismatch");
  });
});

describe("isFinancialChange", () => {
  const base = { subtotal: 10000, total_amount: 10000, discount_type: "flat", discount_value: 0, tax_rate: 0, tax_amount: 0, currency: "USD", due_date: "2026-05-01" };

  it("returns false when nothing changed", () => {
    expect(isFinancialChange(base, { ...base })).toBe(false);
  });

  it("returns true when total_amount changes", () => {
    expect(isFinancialChange(base, { ...base, total_amount: 9000 })).toBe(true);
  });

  it("returns true when due_date changes", () => {
    expect(isFinancialChange(base, { ...base, due_date: "2026-04-25" })).toBe(true);
  });

  it("returns false when only cosmetic fields change", () => {
    expect(isFinancialChange(base, { ...base, notes: "updated", template_id: "new" })).toBe(false);
  });
});

describe("computeBalanceDue", () => {
  it("returns full balance when no payments", () => {
    const result = computeBalanceDue(10000, []);
    expect(result.totalPaidCents).toBe(0);
    expect(result.totalRefundedCents).toBe(0);
    expect(result.balanceDueCents).toBe(10000);
  });

  it("reduces balance for completed payments", () => {
    const result = computeBalanceDue(10000, [
      { amountCents: 3000, status: "completed" },
      { amountCents: 2000, status: "completed" },
    ]);
    expect(result.totalPaidCents).toBe(5000);
    expect(result.balanceDueCents).toBe(5000);
  });

  it("handles refunds (negative amounts)", () => {
    const result = computeBalanceDue(10000, [
      { amountCents: 10000, status: "completed" },  // full payment
      { amountCents: -2000, status: "completed" },   // $20 refund
    ]);
    expect(result.totalPaidCents).toBe(10000);
    expect(result.totalRefundedCents).toBe(2000);
    expect(result.balanceDueCents).toBe(2000); // $20 owed again after refund
  });

  it("ignores non-completed payments", () => {
    const result = computeBalanceDue(10000, [
      { amountCents: 10000, status: "pending" },
      { amountCents: 5000, status: "completed" },
    ]);
    expect(result.totalPaidCents).toBe(5000);
    expect(result.balanceDueCents).toBe(5000);
  });

  it("handles overpayment (negative balance)", () => {
    const result = computeBalanceDue(5000, [
      { amountCents: 10000, status: "completed" },
    ]);
    expect(result.balanceDueCents).toBe(-5000); // overpaid by $50
  });
});

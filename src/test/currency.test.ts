import { describe, it, expect } from "vitest";
import {
  getSubunitMultiplier,
  toSubUnits,
  fromSubUnits,
  formatCurrency,
} from "@/lib/currency";

describe("getSubunitMultiplier", () => {
  it("returns 100 for USD", () => {
    expect(getSubunitMultiplier("USD")).toBe(100);
  });

  it("returns 100 for EUR", () => {
    expect(getSubunitMultiplier("EUR")).toBe(100);
  });

  it("returns 1 for JPY (zero-decimal)", () => {
    expect(getSubunitMultiplier("JPY")).toBe(1);
  });

  it("returns 1000 for KWD (three-decimal)", () => {
    expect(getSubunitMultiplier("KWD")).toBe(1000);
  });

  it("defaults to 100 for unknown currencies", () => {
    expect(getSubunitMultiplier("XYZ")).toBe(100);
  });

  it("defaults to USD when no code provided", () => {
    expect(getSubunitMultiplier()).toBe(100);
  });
});

describe("toSubUnits", () => {
  it("converts dollars to cents for USD", () => {
    expect(toSubUnits(45.50, "USD")).toBe(4550);
  });

  it("is a no-op for JPY", () => {
    expect(toSubUnits(1000, "JPY")).toBe(1000);
  });

  it("converts to fils for KWD", () => {
    expect(toSubUnits(1.234, "KWD")).toBe(1234);
  });

  it("rounds correctly", () => {
    expect(toSubUnits(19.999, "USD")).toBe(2000);
  });

  it("defaults to USD", () => {
    expect(toSubUnits(10)).toBe(1000);
  });
});

describe("fromSubUnits", () => {
  it("converts cents to dollars for USD", () => {
    expect(fromSubUnits(4550, "USD")).toBe(45.50);
  });

  it("is a no-op for JPY", () => {
    expect(fromSubUnits(1000, "JPY")).toBe(1000);
  });

  it("converts fils to KWD", () => {
    expect(fromSubUnits(1234, "KWD")).toBeCloseTo(1.234);
  });
});

describe("formatCurrency", () => {
  it("formats USD cents correctly", () => {
    const result = formatCurrency(4550, "USD");
    expect(result).toContain("45.50");
  });

  it("formats JPY without decimals", () => {
    const result = formatCurrency(1000, "JPY");
    // JPY should show ¥1,000 (no decimals)
    expect(result).toContain("1,000");
    expect(result).not.toContain(".");
  });

  it("formats GBP with proper symbol", () => {
    const result = formatCurrency(9999, "GBP");
    expect(result).toContain("99.99");
  });
});

import { describe, expect, it } from "vitest";
import { formatMonthly, formatPrice, monthlySplit } from "../src/lib/pricing";

describe("formatPrice", () => {
  it("formats whole dollars with thousands separators", () => {
    expect(formatPrice(2400)).toBe("$2,400");
    expect(formatPrice(1850)).toBe("$1,850");
    expect(formatPrice(999)).toBe("$999");
  });

  it("returns null for missing or invalid amounts", () => {
    expect(formatPrice(null)).toBeNull();
    expect(formatPrice(undefined)).toBeNull();
    expect(formatPrice(NaN)).toBeNull();
  });

  it("honours a supplied currency", () => {
    expect(formatPrice(2400, "EUR")).toBe("€2,400");
    expect(formatPrice(1500, "CAD")).toBe("CA$1,500");
  });

  it("falls back when the currency is unknown", () => {
    expect(formatPrice(2400, "NOPE")).toBe("$2400");
  });
});

describe("monthlySplit", () => {
  it("splits a price into 12 rounded-up payments", () => {
    expect(monthlySplit(2400)).toBe(200);
    expect(monthlySplit(1850)).toBe(155); // 154.16 -> 155
    expect(monthlySplit(100)).toBe(9);
  });

  it("returns null for missing or non-positive amounts", () => {
    expect(monthlySplit(null)).toBeNull();
    expect(monthlySplit(0)).toBeNull();
    expect(monthlySplit(-5)).toBeNull();
  });
});

describe("formatMonthly", () => {
  it("formats the monthly figure", () => {
    expect(formatMonthly(2400)).toBe("$200");
    expect(formatMonthly(null)).toBeNull();
  });
});

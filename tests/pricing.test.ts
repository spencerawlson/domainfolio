import { describe, expect, it } from "vitest";
import { formatLeaseMonthly, formatPrice, leaseMonthly } from "../src/lib/pricing";

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

describe("leaseMonthly", () => {
  it("splits a price over the stated lease term, rounded up", () => {
    expect(leaseMonthly(2400, 12)).toBe(200);
    expect(leaseMonthly(3330, 40)).toBe(84); // 83.25 -> 84
    expect(leaseMonthly(2260, 25)).toBe(91); // 90.40 -> 91
    expect(leaseMonthly(1730, 19)).toBe(92); // 91.05 -> 92
  });

  it("returns null for missing or non-positive amounts", () => {
    expect(leaseMonthly(null, 12)).toBeNull();
    expect(leaseMonthly(0, 12)).toBeNull();
    expect(leaseMonthly(-5, 12)).toBeNull();
  });

  it("returns null without a valid term — no assumed split", () => {
    expect(leaseMonthly(2400, null)).toBeNull();
    expect(leaseMonthly(2400, undefined)).toBeNull();
    expect(leaseMonthly(2400, 0)).toBeNull();
    expect(leaseMonthly(2400, 2.5)).toBeNull();
  });
});

describe("formatLeaseMonthly", () => {
  it("formats the monthly figure", () => {
    expect(formatLeaseMonthly(2400, 12)).toBe("$200");
    expect(formatLeaseMonthly(3330, 40)).toBe("$84");
    expect(formatLeaseMonthly(null, 12)).toBeNull();
    expect(formatLeaseMonthly(2400, null)).toBeNull();
  });
});

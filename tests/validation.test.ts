import { describe, expect, it } from "vitest";
import { validateOffer } from "../src/lib/validation";

const base = {
  domain: "BlueMeadow.COM",
  name: "Jane Buyer",
  email: "jane@example.com",
  amount: "2500",
  message: "Interested in this name.",
};

describe("validateOffer", () => {
  it("accepts a valid offer and normalizes it", () => {
    const o = validateOffer(base);
    expect(o).toMatchObject({
      domain: "bluemeadow.com",
      name: "Jane Buyer",
      email: "jane@example.com",
      amount: 2500,
      isBot: false,
    });
  });

  it("accepts offers with no amount and no message", () => {
    const o = validateOffer({ domain: "a.com", name: "N", email: "n@e.co" });
    expect(o.amount).toBeNull();
    expect(o.message).toBeNull();
  });

  it("treats a filled honeypot as a bot without storing", () => {
    const o = validateOffer({ ...base, website: "http://spam.example" });
    expect(o.isBot).toBe(true);
  });

  it("rejects missing or invalid fields", () => {
    expect(() => validateOffer({ ...base, domain: "" })).toThrow("domain");
    expect(() => validateOffer({ ...base, name: "  " })).toThrow("name");
    expect(() => validateOffer({ ...base, email: "not-an-email" })).toThrow("email");
    expect(() => validateOffer({ ...base, amount: "-5" })).toThrow("positive");
    expect(() => validateOffer({ ...base, amount: "abc" })).toThrow("positive");
    expect(() => validateOffer({ ...base, message: "x".repeat(2001) })).toThrow("2000");
  });

  it("rounds amounts to cents", () => {
    const o = validateOffer({ ...base, amount: "2500.456" });
    expect(o.amount).toBe(2500.46);
  });
});

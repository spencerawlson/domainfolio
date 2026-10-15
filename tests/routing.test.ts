import { describe, expect, it } from "vitest";
import { normalizeHost, rewritePath, routeHost } from "../src/lib/routing";

const ctx = (domains: Record<string, string>) => ({
  portfolioHost: "portfolio.example",
  lookup: (d: string) => domains[d] ?? null,
});

describe("normalizeHost", () => {
  it("lowercases and strips www, port and whitespace", () => {
    expect(normalizeHost("BlueMeadow.COM")).toBe("bluemeadow.com");
    expect(normalizeHost("www.cartnova.com")).toBe("cartnova.com");
    expect(normalizeHost("getpilotly.com:3000")).toBe("getpilotly.com");
    expect(normalizeHost("  WWW.Example.com:8080  ")).toBe("example.com");
    expect(normalizeHost(null)).toBe("");
  });

  it("does not strip deeper subdomains", () => {
    expect(normalizeHost("shop.cartnova.com")).toBe("shop.cartnova.com");
  });
});

describe("routeHost", () => {
  const inv = {
    "bluemeadow.com": "for_sale",
    "brightquill.io": "sold",
    "quietfield.com": "hold",
  };

  it("routes the portfolio host to the catalog", () => {
    expect(routeHost("portfolio.example", ctx(inv))).toEqual({ type: "portfolio" });
    expect(routeHost("www.portfolio.example", ctx(inv))).toEqual({ type: "portfolio" });
    expect(routeHost("PORTFOLIO.EXAMPLE:3000", ctx(inv))).toEqual({ type: "portfolio" });
  });

  it("routes for-sale domains to the lander", () => {
    expect(routeHost("bluemeadow.com", ctx(inv))).toEqual({
      type: "lander",
      domain: "bluemeadow.com",
    });
    expect(routeHost("WWW.BLUEMEADOW.COM", ctx(inv))).toEqual({
      type: "lander",
      domain: "bluemeadow.com",
    });
  });

  it("routes sold and hold domains to their pages", () => {
    expect(routeHost("brightquill.io", ctx(inv))).toEqual({ type: "sold", domain: "brightquill.io" });
    expect(routeHost("quietfield.com", ctx(inv))).toEqual({ type: "hold", domain: "quietfield.com" });
  });

  it("routes unknown and missing hosts to not-listed", () => {
    expect(routeHost("unknown-example.org", ctx(inv))).toEqual({
      type: "unknown",
      host: "unknown-example.org",
    });
    expect(routeHost(null, ctx(inv))).toEqual({ type: "unknown", host: "" });
  });

  it("treats draft domains as unknown (never public)", () => {
    const c = ctx({ "draftname.com": "draft" });
    expect(routeHost("draftname.com", c)).toEqual({ type: "unknown", host: "draftname.com" });
  });
});

describe("rewritePath", () => {
  it("maps decisions to paths", () => {
    expect(rewritePath({ type: "portfolio" })).toBeNull();
    expect(rewritePath({ type: "lander", domain: "a.com" })).toBe("/lander/a.com");
    expect(rewritePath({ type: "sold", domain: "a.com" })).toBe("/sold/a.com");
    expect(rewritePath({ type: "hold", domain: "a.com" })).toBe("/hold/a.com");
    expect(rewritePath({ type: "unknown", host: "x.org" })).toBe("/not-listed");
  });
});

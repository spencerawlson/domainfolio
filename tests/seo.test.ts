import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { landerCanonical, portfolioOrigin, sitemapEntries } from "../src/lib/seo";

describe("portfolioOrigin", () => {
  it("prefers PORTFOLIO_URL and strips a trailing slash", () => {
    expect(portfolioOrigin("https://domainfolio.site/", "other.example")).toBe(
      "https://domainfolio.site",
    );
  });

  it("falls back to the request host", () => {
    expect(portfolioOrigin("", "domainfolio.site")).toBe("https://domainfolio.site");
    expect(portfolioOrigin(undefined, "WWW.Domainfolio.Site:3000")).toBe(
      "https://domainfolio.site",
    );
  });

  it("returns null when nothing is configured", () => {
    expect(portfolioOrigin("", null)).toBeNull();
    expect(portfolioOrigin(undefined, "")).toBeNull();
  });
});

describe("landerCanonical", () => {
  it("is the https root of the lander domain", () => {
    expect(landerCanonical("axionory.com")).toBe("https://axionory.com/");
    expect(landerCanonical("  Bluemeadow.COM ")).toBe("https://bluemeadow.com/");
  });
});

describe("sitemapEntries", () => {
  it("lists the catalog plus one entry per for-sale lander, each on its own host", () => {
    expect(
      sitemapEntries("https://domainfolio.site", [
        { domain: "axionory.com" },
        { domain: "opsnestly.com" },
      ]),
    ).toEqual([
      { url: "https://domainfolio.site/" },
      { url: "https://axionory.com/" },
      { url: "https://opsnestly.com/" },
    ]);
  });

  it("includes a reserved (hold) lander: it stays listed with its own canonical", () => {
    expect(
      sitemapEntries("https://domainfolio.site", [
        { domain: "axionory.com", status: "hold" },
        { domain: "opsnestly.com" },
      ]),
    ).toEqual([
      { url: "https://domainfolio.site/" },
      { url: "https://axionory.com/" },
      { url: "https://opsnestly.com/" },
    ]);
  });

  it("lists only the catalog when nothing is for sale", () => {
    expect(sitemapEntries("https://domainfolio.site", [])).toEqual([
      { url: "https://domainfolio.site/" },
    ]);
  });
});

describe("public/robots.txt", () => {
  it("declares the sitemap and allows crawling", () => {
    const robots = readFileSync(
      path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "robots.txt"),
      "utf8",
    );
    expect(robots).toContain("Sitemap: https://domainfolio.site/sitemap.xml");
    expect(robots).toContain("Allow: /");
  });
});

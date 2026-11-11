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
  const catalog = [
    { domain: "axionory.com", status: "hold" },
    { domain: "opsnestly.com", status: "for_sale" },
    { domain: "trivantaq.com", status: "for_sale" },
  ];

  it("on the portfolio host lists only same-host URLs: catalog + hold pages", () => {
    expect(
      sitemapEntries("domainfolio.site", "https://domainfolio.site", catalog),
    ).toEqual([
      { url: "https://domainfolio.site/" },
      { url: "https://domainfolio.site/hold/axionory.com/" },
    ]);
  });

  it("never lists a lander URL on the portfolio host", () => {
    const urls = sitemapEntries(
      "domainfolio.site",
      "https://domainfolio.site",
      catalog,
    ).map((e) => e.url);
    for (const u of urls) {
      expect(u.startsWith("https://domainfolio.site/")).toBe(true);
    }
  });

  it("on the portfolio host lists a /sold/ page for a sold domain", () => {
    expect(
      sitemapEntries("domainfolio.site", "https://domainfolio.site", [
        { domain: "brightquill.io", status: "sold" },
      ]),
    ).toEqual([
      { url: "https://domainfolio.site/" },
      { url: "https://domainfolio.site/sold/brightquill.io/" },
    ]);
  });

  it("lists only the catalog on the portfolio host when nothing is listed", () => {
    expect(sitemapEntries("domainfolio.site", "https://domainfolio.site", [])).toEqual([
      { url: "https://domainfolio.site/" },
    ]);
  });

  it("on a hold lander host lists only that lander's own root", () => {
    expect(
      sitemapEntries("axionory.com", "https://domainfolio.site", catalog),
    ).toEqual([{ url: "https://axionory.com/" }]);
  });

  it("on a for-sale lander host lists only that lander's own root", () => {
    expect(
      sitemapEntries("opsnestly.com", "https://domainfolio.site", catalog),
    ).toEqual([{ url: "https://opsnestly.com/" }]);
  });

  it("on an unknown host lists only that host's own root", () => {
    expect(
      sitemapEntries("ventoryn.app", "https://domainfolio.site", catalog),
    ).toEqual([{ url: "https://ventoryn.app/" }]);
  });

  it("normalizes the request host (case, port, www)", () => {
    expect(
      sitemapEntries("WWW.Axionory.COM:3000", "https://domainfolio.site", catalog),
    ).toEqual([{ url: "https://axionory.com/" }]);
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

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  OG_IMAGE_ALT,
  OG_IMAGE_URL,
  SITE_DESCRIPTION,
} from "../src/lib/site";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel: string) => readFileSync(path.join(root, rel), "utf8");

describe("site meta description (R-14)", () => {
  it("is 120–160 chars and names the real listings", () => {
    expect(SITE_DESCRIPTION.length).toBeGreaterThanOrEqual(120);
    expect(SITE_DESCRIPTION.length).toBeLessThanOrEqual(160);
    for (const domain of [
      "axionory.com",
      "trivantaq.com",
      "opsnestly.com",
      "ventoryn.app",
    ]) {
      expect(SITE_DESCRIPTION).toContain(domain);
    }
  });

  it("is the description the root layout serves", () => {
    expect(read("src/app/layout.tsx")).toContain("SITE_DESCRIPTION");
    expect(read("src/app/layout.tsx")).not.toContain(
      '"Premium domain names for sale."',
    );
  });
});

describe("social preview image (R-08)", () => {
  it("is a 1200×630 PNG at the URL the metadata points to", () => {
    expect(OG_IMAGE_URL).toBe("https://domainfolio.site/og-image.png");
    const file = path.join(root, "public", "og-image.png");
    expect(existsSync(file)).toBe(true);
    const buf = readFileSync(file);
    // PNG signature + IHDR width/height (big-endian uint32 at offsets 16/20).
    expect(buf.subarray(0, 8)).toEqual(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    );
    expect(buf.readUInt32BE(16)).toBe(1200);
    expect(buf.readUInt32BE(20)).toBe(630);
    expect(OG_IMAGE_ALT.length).toBeGreaterThan(0);
  });

  it("is wired into the layout as og:image + summary_large_image", () => {
    const layout = read("src/app/layout.tsx");
    expect(layout).toContain("OG_IMAGE_URL");
    expect(layout).toContain("OG_IMAGE_ALT");
    expect(layout).toContain('card: "summary_large_image"');
    expect(layout).toContain("openGraph");
  });
});

describe("favicon (R-10)", () => {
  it("ships a real /favicon.ico (valid ICO header)", () => {
    const file = path.join(root, "public", "favicon.ico");
    expect(existsSync(file)).toBe(true);
    const buf = readFileSync(file);
    // ICO: reserved 0, type 1 (icon), count >= 1.
    expect(buf.readUInt16LE(0)).toBe(0);
    expect(buf.readUInt16LE(2)).toBe(1);
    expect(buf.readUInt16LE(4)).toBeGreaterThanOrEqual(1);
  });

  it("is linked from the layout metadata", () => {
    expect(read("src/app/layout.tsx")).toContain('"/favicon.ico"');
  });
});

describe("legal pages + cookie consent (R-03, R-04)", () => {
  it("has /privacy and /terms routes with real content", () => {
    for (const page of ["privacy", "terms"]) {
      const src = read(`src/app/${page}/page.tsx`);
      expect(src).toContain("<h1>");
      expect(src.length).toBeGreaterThan(1000);
    }
    expect(read("src/app/privacy/page.tsx")).toContain("df_admin");
    expect(read("src/app/terms/page.tsx")).toContain("escrow");
  });

  it("links the legal pages from the footer", () => {
    const nav = read("src/components/SiteNav.tsx");
    expect(nav).toContain('href="/privacy"');
    expect(nav).toContain('href="/terms"');
  });

  it("renders a cookie-consent banner with a preference control", () => {
    const banner = read("src/components/CookieConsent.tsx");
    expect(banner).toContain("data-cookie-consent");
    expect(banner).toContain("domainfolio-cookie-consent");
    expect(banner).toContain("Reject non-essential");
    expect(banner).toContain("Preferences");
    expect(read("src/app/layout.tsx")).toContain("<CookieConsent />");
  });
});

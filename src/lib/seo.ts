import { normalizeHost } from "./routing";

/**
 * SEO helpers: host-aware canonical URLs and sitemap entries.
 *
 * The app is multi-tenant: one deployment serves the portfolio catalog at
 * PORTFOLIO_URL and one lander per for-sale domain at https://<domain>/.
 * Canonicals are therefore always absolute https URLs on the host the page
 * is actually served from — never a relative URL, and never the tunnel's
 * bind address (see src/lib/http.ts for why absolute redirects are banned).
 */

/**
 * Canonical origin for the portfolio catalog. Prefers PORTFOLIO_URL; falls
 * back to the request Host header. Returns null when neither is available —
 * callers then omit the canonical rather than inventing one.
 */
export function portfolioOrigin(
  portfolioUrl: string | undefined,
  host: string | null | undefined,
): string | null {
  const configured = (portfolioUrl || "").trim().replace(/\/+$/, "");
  if (configured) return configured;
  const h = normalizeHost(host);
  return h ? `https://${h}` : null;
}

/** Canonical URL for a lander-domain root page (for_sale, sold, or hold). */
export function landerCanonical(domain: string): string {
  return `https://${domain.trim().toLowerCase()}/`;
}

export interface SitemapDomain {
  domain: string;
}

/**
 * Public sitemap entries: the catalog plus one entry per for-sale lander,
 * each on its own domain. No admin pages, no API routes, no offer
 * endpoints, no hold/draft/sold pages.
 */
export function sitemapEntries(
  portfolioUrl: string,
  domains: SitemapDomain[],
): { url: string }[] {
  const base = portfolioUrl.replace(/\/+$/, "");
  const entries = [{ url: `${base}/` }];
  for (const d of domains) {
    entries.push({ url: landerCanonical(d.domain) });
  }
  return entries;
}

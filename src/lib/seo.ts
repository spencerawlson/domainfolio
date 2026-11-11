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
  status?: string;
}

/**
 * Host-aware sitemap entries: a sitemap may only list URLs on the host it
 * is served from — Google rejects cross-domain URLs with "URL not allowed"
 * (Search Console, Nov 2026; the previous version listed the catalog plus
 * one lander URL per domain and was rejected).
 *
 * - Portfolio host: the catalog plus one portfolio-host page per hold
 *   (/hold/<domain>) and per sold (/sold/<domain>) domain. For-sale domains
 *   have no portfolio-host page — their page is the lander itself — so they
 *   contribute nothing here.
 * - A lander host in the catalog (for_sale or hold): its own root only.
 * - Any other host: its own root only.
 * No admin pages, no API routes, no offer endpoints.
 */
export function sitemapEntries(
  requestHost: string | null | undefined,
  portfolioUrl: string,
  domains: SitemapDomain[],
): { url: string }[] {
  const host = normalizeHost(requestHost);
  const portfolioHost = normalizeHost(
    portfolioUrl.replace(/^[a-z]+:\/\//i, "").replace(/\/+$/, ""),
  );
  const effectiveHost = host || portfolioHost;
  if (!effectiveHost) return [];
  const base = `https://${effectiveHost}`;

  if (effectiveHost === portfolioHost) {
    const entries = [{ url: `${base}/` }];
    for (const d of domains) {
      const domain = d.domain.trim().toLowerCase();
      if (!domain) continue;
      if (d.status === "hold") {
        entries.push({ url: `${base}/hold/${domain}/` });
      } else if (d.status === "sold") {
        entries.push({ url: `${base}/sold/${domain}/` });
      }
    }
    return entries;
  }

  return [{ url: `${base}/` }];
}

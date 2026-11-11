import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { listCatalog } from "@/lib/inventory";
import { portfolioOrigin, sitemapEntries } from "@/lib/seo";

// The sitemap reflects live inventory on every request — never bake a
// build-time list into it.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const h = await headers();
  const host = h.get("host");
  // PORTFOLIO_URL is set on the host; the Host header always exists in a real
  // request. The literal fallback is the portfolio's canonical host, used only
  // if neither is available (never in production).
  const origin =
    portfolioOrigin(process.env.PORTFOLIO_URL, host) ?? "https://domainfolio.site";
  // A sitemap may only list URLs on the host it is served from, so the
  // builder branches on the request Host: the portfolio host lists the
  // catalog plus hold/sold pages, while each lander host lists only its
  // own root.
  return sitemapEntries(host, origin, listCatalog());
}

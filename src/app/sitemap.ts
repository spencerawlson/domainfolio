import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { listCatalog } from "@/lib/inventory";
import { portfolioOrigin, sitemapEntries } from "@/lib/seo";

// The sitemap reflects live inventory on every request — never bake a
// build-time list into it.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const h = await headers();
  // PORTFOLIO_URL is set on the host; the Host header always exists in a real
  // request. The literal fallback is the portfolio's canonical host, used only
  // if neither is available (never in production).
  const origin =
    portfolioOrigin(process.env.PORTFOLIO_URL, h.get("host")) ?? "https://domainfolio.site";
  return sitemapEntries(origin, listCatalog());
}

import { headers } from "next/headers";
import type { Metadata } from "next";
import { CatalogSearch } from "@/components/CatalogSearch";
import { Shell } from "@/components/SiteNav";
import { categories, listCatalog, listForSale } from "@/lib/inventory";
import { formatPrice } from "@/lib/pricing";
import { portfolioOrigin } from "@/lib/seo";

// The catalog must reflect the live inventory on every request — never bake
// an empty (build-time) list into static HTML.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const origin = portfolioOrigin(process.env.PORTFOLIO_URL, h.get("host"));
  if (!origin) return {};
  return { alternates: { canonical: `${origin}/` } };
}

export default function Home() {
  // Stats (Available count, price range) cover for-sale domains only, so a
  // reserved domain's price never enters the purchase flow.
  const domains = listForSale();
  const cats = categories();
  // The table lists for-sale AND reserved domains; reserved rows carry a
  // Reserved badge and no price (see CatalogSearch).
  const catalog = listCatalog().map((d) => ({
    domain: d.domain,
    // Reserved rows carry no price into the client props at all: the price
    // must not leak into the serialized payload either.
    price: d.status === "hold" ? null : d.price,
    priceLabel: d.status === "hold" ? null : formatPrice(d.price),
    category: d.category,
    tagline: d.tagline,
    status: d.status,
  }));
  const prices = domains.map((d) => d.price).filter((p): p is number => p !== null);
  const range =
    prices.length === 0
      ? "On offer"
      : Math.min(...prices) === Math.max(...prices)
        ? formatPrice(prices[0])
        : `${formatPrice(Math.min(...prices))}–${formatPrice(Math.max(...prices))}`;

  return (
    <Shell title="All domains">
      <div className="page-head">
        <div>
          <h1>Domains for sale</h1>
          <p>Brandable .com names, ready to transfer. Buy outright or make an offer.</p>
        </div>
      </div>

      <div className="stats">
        <div className="card stat">
          <div className="label">Available</div>
          <div className="value">{domains.length}</div>
          <div className="hint">Ready to transfer</div>
        </div>
        <div className="card stat">
          <div className="label">Price range</div>
          <div className="value">{range}</div>
          <div className="hint">Buy it now</div>
        </div>
        <div className="card stat">
          <div className="label">Payment</div>
          <div className="value">Escrow</div>
          <div className="hint">Released after transfer</div>
        </div>
        <div className="card stat">
          <div className="label">Buyer fees</div>
          <div className="value">$0</div>
          <div className="hint">Seller covers fees</div>
        </div>
      </div>

      <section className="card">
        <div className="card-head">
          <h2>Inventory</h2>
          <span className="sub">
            {catalog.length} {catalog.length === 1 ? "name" : "names"}
          </span>
        </div>
        {catalog.length === 0 ? (
          <div className="empty">
            <strong>No domains are listed yet.</strong> Check back soon.
          </div>
        ) : (
          <CatalogSearch domains={catalog} categories={cats} />
        )}
      </section>
    </Shell>
  );
}

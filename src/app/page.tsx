import { CatalogSearch } from "@/components/CatalogSearch";
import { SiteFooter, SiteNav } from "@/components/SiteNav";
import { categories, listForSale } from "@/lib/inventory";
import { formatPrice } from "@/lib/pricing";

// The catalog must reflect the live inventory on every request — never bake
// an empty (build-time) list into static HTML.
export const dynamic = "force-dynamic";

export default function Home() {
  const domains = listForSale();
  const cats = categories();
  const catalog = domains.map((d) => ({
    domain: d.domain,
    price: d.price,
    priceLabel: formatPrice(d.price),
    category: d.category,
    tagline: d.tagline,
  }));

  return (
    <>
      <SiteNav />
      <main>
        <section className="hero">
          <div className="eyebrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20.6 13.4l-7.2 7.2a2 2 0 01-2.8 0L3 13V3h10l7.6 7.6a2 2 0 010 2.8z" />
              <circle cx="7.5" cy="7.5" r="1.5" />
            </svg>
            Hand-picked names, ready to transfer
          </div>
          <h1>Find the name your brand deserves</h1>
          <p className="lede">
            Short, brandable domains for startups and products. Make an offer or buy outright,
            and every sale is completed through an independent escrow service.
          </p>
          <ul className="check-list">
            <li>Escrow-protected payment</li>
            <li>No fees for the buyer</li>
            <li>Fast, guided transfer</li>
          </ul>
        </section>

        <div className="section-head">
          <div>
            <h2>Domains for sale</h2>
            <span className="underline-accent" aria-hidden="true" />
          </div>
          <span className="muted" style={{ marginBottom: "1.25rem" }}>
            {domains.length} {domains.length === 1 ? "name" : "names"} available
          </span>
        </div>

        {catalog.length === 0 ? (
          <div className="empty">
            <strong>No domains are listed yet.</strong> Check back soon — new names are added
            regularly.
          </div>
        ) : (
          <CatalogSearch domains={catalog} categories={cats} />
        )}
      </main>
      <SiteFooter />
    </>
  );
}

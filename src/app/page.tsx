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
            <span className="pulse-dot" aria-hidden="true" />
            Brandable .com names · Ready to transfer
          </div>
          <h1>
            The name comes first. <span className="kinetic">Make it unforgettable.</span>
          </h1>
          <p className="lede">
            Short, brandable domains for startups and products. Buy outright or make an offer,
            and every sale settles through an independent escrow service, so your payment is
            only released once the domain is in your account.
          </p>
          <ul className="trust-strip">
            <li>Escrow-protected payment</li>
            <li>No buyer fees</li>
            <li>Guided transfer</li>
          </ul>
        </section>

        <div className="section-head">
          <div>
            <span className="kicker">Inventory</span>
            <h2>Domains for sale</h2>
          </div>
          <span className="count">
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

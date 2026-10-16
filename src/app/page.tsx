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
            <span className="status-dot healthy" aria-hidden="true" />
            Portfolio online
          </div>
          <h1>Premium domains for sale</h1>
          <p className="lede">
            Short, brandable names ready to transfer. Every purchase goes through an independent
            escrow service, so your payment is only released once the domain is in your account.
          </p>
          <div className="stats">
            <div className="stat">
              <span className="label">Available</span>
              <span className="value">{domains.length}</span>
            </div>
            <div className="stat">
              <span className="label">Payment</span>
              <span className="value">Escrow</span>
            </div>
            <div className="stat">
              <span className="label">Transfer</span>
              <span className="value">Fast</span>
            </div>
          </div>
        </section>

        {catalog.length === 0 ? (
          <div className="empty" style={{ marginTop: "2rem" }}>
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

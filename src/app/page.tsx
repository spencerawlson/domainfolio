import { CatalogSearch } from "@/components/CatalogSearch";
import { SiteNav } from "@/components/SiteNav";
import { categories, listForSale } from "@/lib/inventory";
import { formatPrice } from "@/lib/pricing";

// The catalog must reflect the live inventory on every request — never bake
// an empty (build-time) list into static HTML.
export const dynamic = "force-dynamic";

const NAME = process.env.PORTFOLIO_NAME || "Domainfolio";

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
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)" }}>Premium domains for sale</h1>
        <p className="muted" style={{ fontSize: "1.1rem", maxWidth: "640px" }}>
          Hand-picked domain names, ready to transfer. Every purchase goes through an independent
          escrow service, so the money is only released once the domain is in your account.
        </p>

        {catalog.length === 0 ? (
          <div className="notice">
            <strong>No domains are listed yet.</strong> Check back soon — new names are added
            regularly.
          </div>
        ) : (
          <CatalogSearch domains={catalog} categories={cats} />
        )}

        <footer style={{ marginTop: "4rem", borderTop: "1px solid var(--line)", paddingTop: "1.5rem" }}>
          <p className="muted">
            {NAME} — premium domains for sale. Questions? Use the offer form on any domain page.
          </p>
        </footer>
      </main>
    </>
  );
}

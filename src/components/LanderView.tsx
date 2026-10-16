import type { DomainRow } from "@/lib/db";
import { formatPrice } from "@/lib/pricing";
import { OfferForm } from "./OfferForm";
import { DomainName, SiteFooter, SiteNav } from "./SiteNav";

const RESPONSE_TIME = process.env.SELLER_RESPONSE_TIME || "two business days";
const PORTFOLIO_URL = process.env.PORTFOLIO_URL || "";

function headline(status: DomainRow["status"]): string {
  if (status === "sold") return "This domain has been sold";
  if (status === "hold") return "This domain is not currently available";
  return "This domain is for sale";
}

const icon = { width: 20, height: 20, fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

const PERKS = [
  {
    title: "Escrow-protected payment",
    body: "Your money is held by an independent escrow service until the domain is in your account.",
    svg: (
      <svg viewBox="0 0 24 24" {...icon}>
        <path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Quick reply",
    body: `The seller typically responds within ${RESPONSE_TIME}.`,
    svg: (
      <svg viewBox="0 0 24 24" {...icon}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    title: "Free transfer for the buyer",
    body: "The seller covers escrow and transfer fees. The domain moves straight to your registrar.",
    svg: (
      <svg viewBox="0 0 24 24" {...icon}>
        <path d="M5 12h14" />
        <path d="M13 6l6 6-6 6" />
      </svg>
    ),
  },
];

/**
 * Shared sale page: huge domain name and trust points on the left, sticky price +
 * offer card on the right (for-sale only). Used by /lander, /sold and /hold routes.
 */
export function LanderView({ record }: { record: DomainRow }) {
  const price = formatPrice(record.price);
  const minOffer = formatPrice(record.min_offer);
  const forSale = record.status === "for_sale";

  return (
    <>
      <SiteNav showBrowse={Boolean(PORTFOLIO_URL)} />
      <main>
        <div className="lander">
          <section className="lander-hero">
            {record.category && (
              <span className="badge" style={{ marginBottom: "1.25rem" }}>
                {record.category}
              </span>
            )}
            <h1 className="domain">
              <DomainName domain={record.domain} />
            </h1>
            <span className="underline-accent" aria-hidden="true" />
            <p className="headline">{headline(record.status)}</p>
            {record.tagline && <p className="tagline">{record.tagline}</p>}

            {forSale && (
              <ul className="perks">
                {PERKS.map((p) => (
                  <li key={p.title}>
                    <span className="icon">{p.svg}</span>
                    <div>
                      <strong>{p.title}</strong>
                      <span>{p.body}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {forSale ? (
            <aside className="card offer-card" aria-label="Price and offer">
              <div className="price-label">{price ? "Buy it now" : "Open to offers"}</div>
              <div className="price">{price ?? "Make an offer"}</div>
              {minOffer && !price && <p className="monthly">Minimum offer: {minOffer}</p>}
              <hr className="divider" />
              <h2>{price ? "Buy or make an offer" : "Make an offer"}</h2>
              <OfferForm domain={record.domain} minOfferLabel={minOffer} responseTime={RESPONSE_TIME} />
            </aside>
          ) : (
            <aside className="card status-card">
              <span className={`badge ${record.status}`}>
                {record.status === "sold" ? "Sold" : "Reserved"}
              </span>
              <h2 style={{ marginTop: "1rem" }}>
                {record.status === "sold" ? "This name found its owner" : "Not on the market"}
              </h2>
              <p className="muted">
                {record.status === "sold"
                  ? "Similar names may still be available in the portfolio."
                  : "This name is currently reserved and not for sale."}
              </p>
              {PORTFOLIO_URL && (
                <a className="btn block" href={PORTFOLIO_URL}>
                  Browse available domains
                </a>
              )}
            </aside>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

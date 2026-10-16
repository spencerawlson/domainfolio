import type { DomainRow } from "@/lib/db";
import { formatLeaseMonthly, formatPrice } from "@/lib/pricing";
import { OfferForm } from "./OfferForm";
import { DomainName, Shell } from "./SiteNav";

const RESPONSE_TIME = process.env.SELLER_RESPONSE_TIME || "two business days";
const PORTFOLIO_URL = process.env.PORTFOLIO_URL || "";

const STATUS: Record<string, { label: string; tone: string }> = {
  for_sale: { label: "For sale", tone: "ok" },
  sold: { label: "Sold", tone: "bad" },
  hold: { label: "Reserved", tone: "warn" },
};

const STEPS = [
  { title: "Agree on a price", body: "Buy at the listed price or send an offer. The seller replies by email." },
  { title: "Pay into escrow", body: "Your payment is held by an independent escrow service, never sent to the seller directly." },
  { title: "Receive the domain", body: "The domain is transferred to your registrar account. No fees for the buyer." },
  { title: "Escrow releases payment", body: "Only after you confirm the domain is yours does the seller get paid." },
];

/**
 * Listing detail page in the style of an Aegis console resource view:
 * header with status pills, details + process cards, and a sticky offer card.
 * Used by /lander, /sold and /hold routes.
 */
export function LanderView({ record }: { record: DomainRow }) {
  const price = formatPrice(record.price);
  const lease = formatLeaseMonthly(record.price, record.lease_months);
  const minOffer = formatPrice(record.min_offer);
  const forSale = record.status === "for_sale";
  const status = STATUS[record.status] ?? { label: record.status, tone: "" };

  return (
    <Shell title={record.domain} active={record.domain}>
      <div className="listing-head">
        <span className="listing-icon" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
          </svg>
        </span>
        <div>
          <h1>
            <DomainName domain={record.domain} />
          </h1>
          <div className="pills">
            <span className={`pill ${status.tone}`}>
              <span className="dot" aria-hidden="true" />
              {status.label}
            </span>
            {record.category && <span className="pill purple">{record.category}</span>}
          </div>
          {record.tagline && <p>{record.tagline}</p>}
        </div>
      </div>

      <div className="detail-grid">
        <div className="stack">
          <section className="card">
            <div className="card-head">
              <h2>Listing details</h2>
            </div>
            <dl className="kv">
              <dt>Domain</dt>
              <dd className="mono">{record.domain}</dd>
              <dt>Status</dt>
              <dd>{status.label}</dd>
              {forSale && (
                <>
                  <dt>Price</dt>
                  <dd className="mono">{price ?? "Open to offers"}</dd>
                </>
              )}
              {record.category && (
                <>
                  <dt>Category</dt>
                  <dd>{record.category}</dd>
                </>
              )}
              <dt>Payment</dt>
              <dd>Independent escrow</dd>
              <dt>Buyer fees</dt>
              <dd>None — seller covers escrow and transfer</dd>
              <dt>Seller response</dt>
              <dd>Within {RESPONSE_TIME}</dd>
            </dl>
          </section>

          {forSale && (
            <section className="card">
              <div className="card-head">
                <h2>How buying works</h2>
                <span className="sub">Escrow-protected</span>
              </div>
              <ol className="steps">
                {STEPS.map((s, i) => (
                  <li key={s.title}>
                    <span className="num">{i + 1}</span>
                    <div>
                      <strong>{s.title}</strong>
                      <span>{s.body}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>

        {forSale ? (
          <aside className="card offer-card" aria-label="Price and offer">
            <div className="price-label">{price ? "Buy it now" : "Open to offers"}</div>
            <div className="price">{price ?? "Make an offer"}</div>
            {lease && record.lease_months && (
              <p className="monthly">
                or lease-to-own from {lease}/mo for {record.lease_months} months via Afternic
              </p>
            )}
            {minOffer && !price && <p className="monthly">Minimum offer: {minOffer}</p>}
            <hr className="divider" />
            <h2>{price ? "Buy or make an offer" : "Make an offer"}</h2>
            <OfferForm domain={record.domain} minOfferLabel={minOffer} responseTime={RESPONSE_TIME} />
          </aside>
        ) : (
          <aside className="card">
            <div className="card-head">
              <h2>{record.status === "sold" ? "This name found its owner" : "Not on the market"}</h2>
            </div>
            <p className="muted" style={{ marginTop: 0 }}>
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
    </Shell>
  );
}

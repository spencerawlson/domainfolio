import type { DomainRow } from "@/lib/db";
import { formatMonthly, formatPrice } from "@/lib/pricing";
import { OfferForm } from "./OfferForm";
import { SiteNav } from "./SiteNav";

const RESPONSE_TIME = process.env.SELLER_RESPONSE_TIME || "two business days";

function Headline({ status }: { status: DomainRow["status"] }) {
  if (status === "sold") return <h1>This domain has been sold</h1>;
  if (status === "hold") return <h1>This domain is not currently available</h1>;
  return <h1>This domain is for sale</h1>;
}

/**
 * Shared sale page: huge domain name, price block, offer form (for-sale only),
 * trust block. Used by /lander, /sold and /hold routes.
 */
export function LanderView({ record }: { record: DomainRow }) {
  const price = formatPrice(record.price);
  const monthly = formatMonthly(record.price);
  const minOffer = formatPrice(record.min_offer);

  return (
    <>
      <SiteNav />
      <main>
        <p style={{ fontSize: "clamp(2rem, 7vw, 4.5rem)", fontWeight: 800, margin: "2rem 0 0.5rem", wordBreak: "break-all" }}>
          {record.domain}
        </p>
        <Headline status={record.status} />
        {record.tagline && <p style={{ fontSize: "1.2rem" }}>{record.tagline}</p>}
        {record.category && (
          <p>
            <span className="badge">{record.category}</span>
          </p>
        )}

        {record.status === "for_sale" && (
          <div className="card" style={{ margin: "2rem 0", maxWidth: "560px" }}>
            <div style={{ fontSize: "2.25rem", fontWeight: 800, marginBottom: "0.25rem" }}>
              {price ?? "Make an offer"}
            </div>
            {monthly && (
              <p className="muted" style={{ marginTop: 0 }}>
                or 12 monthly payments of {monthly}
              </p>
            )}
            {minOffer && !price && (
              <p className="muted" style={{ marginTop: 0 }}>
                Minimum offer: {minOffer}
              </p>
            )}
            <h2 style={{ fontSize: "1.25rem", marginTop: "1.5rem" }}>Make an offer</h2>
            <OfferForm domain={record.domain} minOfferLabel={minOffer} responseTime={RESPONSE_TIME} />
          </div>
        )}

        {record.status === "sold" && (
          <div className="notice">
            <strong>{record.domain}</strong> has found a new owner. Similar names may still be
            available in the portfolio.
          </div>
        )}

        {record.status === "hold" && (
          <div className="notice">
            <strong>{record.domain}</strong> is currently reserved and not on the market.
          </div>
        )}

        <div className="card" style={{ maxWidth: "560px" }}>
          <h2 style={{ fontSize: "1.25rem" }}>A safe way to buy</h2>
          <ul style={{ paddingLeft: "1.25rem", margin: 0 }}>
            <li>Payment is held by an independent escrow service until the domain is in your account.</li>
            <li>The seller typically responds within {RESPONSE_TIME}.</li>
            <li>The transfer is free for the buyer — the seller covers escrow and transfer fees.</li>
          </ul>
        </div>
      </main>
    </>
  );
}

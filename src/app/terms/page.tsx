import { headers } from "next/headers";
import type { Metadata } from "next";
import { Shell } from "@/components/SiteNav";
import { portfolioOrigin } from "@/lib/seo";

// The shell lists live inventory, so render per request.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const origin = portfolioOrigin(process.env.PORTFOLIO_URL, h.get("host"));
  if (!origin) return { title: "Terms of Sale" };
  return {
    title: "Terms of Sale",
    alternates: { canonical: `${origin}/terms` },
  };
}

export default function Terms() {
  return (
    <Shell title="Terms of Sale">
      <div className="card legal">
        <h1>Terms of Sale</h1>
        <p className="muted">Last updated: November 16, 2026.</p>

        <p>
          These terms cover buying a domain name listed on Domainfolio. By
          making an offer or buying a listed domain, you agree to them.
        </p>

        <h2>Listings and prices</h2>
        <p>
          Each listing shows the domain name, its asking price in US dollars
          where one is set, and the minimum offer where one applies. A domain
          with no asking price is available by offer only. Listings can be
          changed or withdrawn at any time before a sale is agreed, and a
          price may change until then.
        </p>

        <h2>Offers</h2>
        <p>
          An offer is an invitation to negotiate, not a binding purchase.
          Making an offer does not reserve the domain, and a domain can be
          sold to another buyer while your offer is outstanding. If your offer
          is accepted, the agreed price is the sale price. We aim to respond
          to offers within two business days.
        </p>

        <h2>Payment and escrow</h2>
        <p>
          Every sale is completed through an independent escrow service. The
          buyer pays the agreed price into escrow; the seller transfers the
          domain; the escrow service releases the payment to the seller once
          the transfer is confirmed. The buyer pays no additional fee on top
          of the agreed price — the seller covers the escrow fees.
        </p>

        <h2>Transfer</h2>
        <p>
          After escrow confirms payment, the domain is transferred to the
          buyer, normally by a registrar transfer (auth code) or an account
          push at the current registrar. The buyer is responsible for having
          an account at a registrar that can receive the domain and for
          providing correct transfer details. Transfer timing depends on the
          registrars involved; a newly registered domain may also be subject
          to the standard 60-day transfer lock at its registrar.
        </p>

        <h2>What you receive</h2>
        <p>
          The sale covers the domain name registration only — the right to
          use that name at its registrar until its current expiry date. No
          website, content, trademark, or other asset is included unless
          expressly agreed in writing. Domains are sold as-is; the seller
          makes no guarantee about search rankings, traffic, or revenue.
        </p>

        <h2>Refunds</h2>
        <p>
          Because payment is held in escrow until the transfer is confirmed,
          a buyer who does not receive the domain is protected by the escrow
          process. Once the transfer is confirmed and the escrow payment is
          released, the sale is final and no refund is due.
        </p>

        <h2>Changes</h2>
        <p>
          These terms may be updated from time to time. The version in force
          is the one posted here on the date you make an offer or buy.
        </p>
      </div>
    </Shell>
  );
}

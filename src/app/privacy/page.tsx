import { headers } from "next/headers";
import type { Metadata } from "next";
import { Shell } from "@/components/SiteNav";
import { portfolioOrigin } from "@/lib/seo";

// The shell lists live inventory, so render per request.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const origin = portfolioOrigin(process.env.PORTFOLIO_URL, h.get("host"));
  if (!origin) return { title: "Privacy Policy" };
  return {
    title: "Privacy Policy",
    alternates: { canonical: `${origin}/privacy` },
  };
}

export default function Privacy() {
  return (
    <Shell title="Privacy Policy">
      <div className="card legal">
        <h1>Privacy Policy</h1>
        <p className="muted">Last updated: November 16, 2026.</p>

        <p>
          Domainfolio is a portfolio of domain names for sale. This policy
          describes what this site collects when you browse it or make an
          offer — and what it does not.
        </p>

        <h2>What we collect</h2>
        <h3>Offers</h3>
        <p>
          If you make an offer on a domain, the offer form asks for your name,
          your email address, an offer amount, and an optional message. We
          store those details, together with the technical details of the
          submission (IP address and browser information), in the site&apos;s
          own database. We use them only to review your offer, reply to you,
          and complete a sale. We do not sell offer data or use it for
          marketing.
        </p>
        <h3>Visit counts</h3>
        <p>
          When a sale page is visited, the site records the domain, the page
          path, the referring page, and the browser information in its own
          database, solely to count visits. Automated crawlers are excluded.
          No third-party analytics service receives this data.
        </p>

        <h2>Cookies and tracking</h2>
        <p>
          The site sets one cookie, <code>df_admin</code>, and only for the
          site owner after signing in to the admin area: a signed session
          cookie that lasts 7 days. Ordinary visitors never receive it.
        </p>
        <p>
          Your cookie-consent choice is stored in your own browser (local
          storage), not in a cookie, and no non-essential cookie is set until
          you allow it. The site currently runs no analytics and no
          advertising trackers. If analytics is added later, it will stay off
          until you allow it in the cookie preferences, which you can reopen
          from the &ldquo;Cookie settings&rdquo; link in the footer.
        </p>

        <h2>Who we share data with</h2>
        <p>
          Every sale is completed through an independent escrow service. To
          complete a sale, the details needed for payment and for the domain
          transfer are shared with that escrow provider. Some names are also
          listed on third-party marketplaces (for example Afternic); if you
          buy through a marketplace, that marketplace&apos;s own privacy
          policy applies to the information you give it.
        </p>

        <h2>How long we keep data</h2>
        <p>
          Offers are kept as business records of the sale process and deleted
          when they are no longer needed for that purpose. Visit counts are
          kept in aggregate form.
        </p>

        <h2>Your rights</h2>
        <p>
          You can ask for a copy of the personal information we hold about
          you, ask us to correct it, or ask us to delete it. To do so, send
          an offer-form message on any domain&apos;s sale page with
          &ldquo;Privacy request&rdquo; in the message, including the email
          address you used, and we will respond.
        </p>

        <h2>Changes</h2>
        <p>
          If this policy changes, the updated version will be posted here
          with a new &ldquo;last updated&rdquo; date.
        </p>
      </div>
    </Shell>
  );
}

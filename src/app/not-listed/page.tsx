import { SiteNav } from "@/components/SiteNav";

const NAME = process.env.PORTFOLIO_NAME || "Domainfolio";
const URL = process.env.PORTFOLIO_URL || "";

export default function NotListed() {
  return (
    <>
      <SiteNav />
      <main>
        <h1>This domain is not listed for sale</h1>
        <p className="muted" style={{ fontSize: "1.1rem", maxWidth: "600px" }}>
          The name you are looking for is not part of the {NAME} portfolio. It may belong to
          someone else, or it may simply not be on the market right now.
        </p>
        {URL && (
          <p>
            <a className="btn" href={URL}>
              Browse domains for sale
            </a>
          </p>
        )}
      </main>
    </>
  );
}

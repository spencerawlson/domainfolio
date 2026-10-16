import { listForSale } from "@/lib/inventory";
import { formatPrice } from "@/lib/pricing";

const NAME = process.env.PORTFOLIO_NAME || "Domainfolio";
// On a lander host "/" is the lander itself, so links back to the catalog use
// the portfolio's canonical URL when one is configured.
const HOME = process.env.PORTFOLIO_URL || "/";

const icon = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/**
 * Console-style page shell modeled on the signed-in Aegis CloudOps app:
 * dark sidebar listing the portfolio, white top bar with breadcrumb + status.
 * `active` is the domain being viewed ("" for the catalog).
 */
export function Shell({
  title,
  active,
  children,
}: {
  title: string;
  active?: string;
  children: React.ReactNode;
}) {
  const domains = listForSale();
  return (
    <div className="shell">
      <aside className="sidebar" aria-label="Portfolio">
        <a href={HOME} className="side-brand">
          <span className="brand-mark" aria-hidden="true">
            {NAME.charAt(0).toUpperCase()}
          </span>
          <span>
            <strong>{NAME}</strong>
            <small>Domain portfolio</small>
          </span>
        </a>
        <nav className="side-nav">
          <div className="side-label">Browse</div>
          <a href={HOME} className={`side-item${active ? "" : " active"}`}>
            <svg {...icon}>
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            <span className="label">All domains</span>
            <span className="meta">{domains.length}</span>
          </a>
          <div className="side-label">For sale</div>
          {domains.map((d) => (
            <a
              key={d.domain}
              href={`https://${d.domain}/`}
              className={`side-item${active === d.domain ? " active" : ""}`}
              aria-current={active === d.domain ? "page" : undefined}
            >
              <span className="status" aria-hidden="true" />
              <span className="label">{d.domain}</span>
              <span className="meta">{formatPrice(d.price) ?? "Offer"}</span>
            </a>
          ))}
        </nav>
        <div className="side-foot">
          <svg {...icon} width={14} height={14}>
            <path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3z" />
          </svg>
          Every sale settles through escrow
        </div>
      </aside>

      <div className="shell-main">
        <header className="topbar">
          <div className="crumbs">
            <a href={HOME} className="topbar-brand">
              <span className="brand-mark" aria-hidden="true">
                {NAME.charAt(0).toUpperCase()}
              </span>
            </a>
            <a href={HOME} className="root">
              {NAME}
            </a>
            <span className="root" aria-hidden="true">
              /
            </span>
            <strong>{title}</strong>
          </div>
          <span className="pill ok">
            <span className="dot" aria-hidden="true" />
            Escrow-protected
          </span>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <span>
            © {new Date().getFullYear()} {NAME}
          </span>
          <span>Every sale is completed through an independent escrow service.</span>
        </footer>
      </div>
    </div>
  );
}

/** Render "axionory.com" as name + styled TLD. */
export function DomainName({ domain }: { domain: string }) {
  const dot = domain.indexOf(".");
  if (dot <= 0) return <>{domain}</>;
  return (
    <>
      {domain.slice(0, dot)}
      <span className="tld">{domain.slice(dot)}</span>
    </>
  );
}

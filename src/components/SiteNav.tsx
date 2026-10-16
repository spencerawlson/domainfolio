const NAME = process.env.PORTFOLIO_NAME || "Domainfolio";
// On a lander host "/" is the lander itself, so the brand links to the
// portfolio's canonical URL when one is configured.
const HOME = process.env.PORTFOLIO_URL || "/";

export function SiteNav({ showBrowse = false }: { showBrowse?: boolean }) {
  return (
    <header className="nav-wrap">
      <nav className="nav">
        <a href={HOME} className="brand">
          <span className="brand-mark" aria-hidden="true">
            {NAME.charAt(0).toUpperCase()}
          </span>
          {NAME}
        </a>
        {showBrowse ? (
          <a href={HOME} className="nav-link">
            Browse all domains →
          </a>
        ) : (
          <span className="nav-link tagline-text">
            <span className="status-dot healthy" aria-hidden="true" />
            Escrow-protected sales
          </span>
        )}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="inner">
        <span>
          © {year} {NAME}
        </span>
        <span>Every sale is completed through an independent escrow service.</span>
      </div>
    </footer>
  );
}

/** Render "axionory.com" as name + muted/accented TLD. */
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

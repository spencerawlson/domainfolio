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
          <BrandWord name={NAME} />
        </a>
        {showBrowse ? (
          <a href={HOME} className="btn">
            Browse all domains
          </a>
        ) : (
          <span className="nav-link tagline-text">Escrow-protected domain sales</span>
        )}
      </nav>
    </header>
  );
}

/** Two-tone wordmark like "Aegis CloudOps": "Domainfolio" → "Domain" + accented "folio". */
function BrandWord({ name }: { name: string }) {
  const m = /^(Domain)(.+)$/.exec(name);
  if (!m) return <span>{name}</span>;
  // One wrapping span so the brand's flex gap doesn't split the word.
  return (
    <span>
      {m[1]}
      <span className="accent">{m[2]}</span>
    </span>
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

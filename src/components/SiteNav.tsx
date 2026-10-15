import Link from "next/link";

export function SiteNav() {
  const name = process.env.PORTFOLIO_NAME || "Domainfolio";
  return (
    <nav className="nav">
      <Link href="/" className="brand">
        {name}
      </Link>
      <span className="muted" style={{ fontSize: "0.9rem" }}>
        Premium domains for sale
      </span>
    </nav>
  );
}

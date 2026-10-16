import Link from "next/link";

export function AdminNav() {
  return (
    <nav className="nav">
      <Link href="/admin" className="brand">
        Domainfolio · Admin
      </Link>
      <div style={{ display: "flex", gap: "1rem", fontSize: "0.95rem" }}>
        <Link href="/admin/domains">Domains</Link>
        <Link href="/admin/offers">Offers</Link>
        <Link href="/admin/visits">Visits</Link>
        <Link href="/" style={{ color: "var(--ink-soft)" }}>
          View site
        </Link>
      </div>
    </nav>
  );
}

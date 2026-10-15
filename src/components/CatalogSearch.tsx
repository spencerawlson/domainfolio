"use client";

import { useMemo, useState } from "react";

export interface CatalogDomain {
  domain: string;
  price: number | null;
  priceLabel: string | null;
  category: string | null;
  tagline: string | null;
}

export function CatalogSearch({
  domains,
  categories,
}: {
  domains: CatalogDomain[];
  categories: string[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return domains.filter((d) => {
      if (category && d.category !== category) return false;
      if (!q) return true;
      return (
        d.domain.toLowerCase().includes(q) ||
        (d.tagline || "").toLowerCase().includes(q)
      );
    });
  }, [domains, query, category]);

  return (
    <>
      <div className="toolbar">
        <input
          type="search"
          placeholder="Search domains…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search domains"
          style={{ flex: "1 1 220px" }}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category">
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="muted">No domains match your search.</p>
      ) : (
        <div className="grid">
          {filtered.map((d) => (
            <article key={d.domain} className="card">
              <h3 style={{ fontSize: "1.35rem", marginBottom: "0.25rem" }}>{d.domain}</h3>
              {d.category && (
                <span className="badge" style={{ marginBottom: "0.6rem" }}>
                  {d.category}
                </span>
              )}
              {d.tagline && <p className="muted" style={{ margin: "0.5rem 0 1rem" }}>{d.tagline}</p>}
              <div style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem" }}>
                {d.priceLabel ?? "Make an offer"}
              </div>
              <a
                className="btn"
                href={`https://${d.domain}/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View this domain
              </a>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

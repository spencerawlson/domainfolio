"use client";

import { useMemo, useState } from "react";

export interface CatalogDomain {
  domain: string;
  price: number | null;
  priceLabel: string | null;
  category: string | null;
  tagline: string | null;
}

function splitDomain(domain: string): [string, string] {
  const dot = domain.indexOf(".");
  return dot > 0 ? [domain.slice(0, dot), domain.slice(dot)] : [domain, ""];
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
          style={{ flex: "1 1 240px" }}
        />
        {categories.length > 1 && (
          <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category">
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="empty">No domains match your search.</div>
      ) : (
        <div className="grid">
          {filtered.map((d) => {
            const [name, tld] = splitDomain(d.domain);
            return (
              <a
                key={d.domain}
                className="card domain-card"
                href={`https://${d.domain}/`}
                aria-label={`${d.domain}${d.priceLabel ? `, ${d.priceLabel}` : ""}`}
              >
                <div className="top">
                  {d.category ? <span className="badge">{d.category}</span> : <span />}
                  <span className="live">
                    <span className="pulse-dot green" aria-hidden="true" />
                    Available
                  </span>
                </div>
                <h3 className="name">
                  {name}
                  <span className="tld">{tld}</span>
                </h3>
                {d.tagline && <p className="tagline">{d.tagline}</p>}
                <div className="foot">
                  <span className="price">{d.priceLabel ?? "Make an offer"}</span>
                  <span className="go">View →</span>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </>
  );
}

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
          style={{ flex: "1 1 220px" }}
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
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Domain</th>
                <th className="hide-sm">Category</th>
                <th>Price</th>
                <th className="hide-sm">Status</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => {
                const [name, tld] = splitDomain(d.domain);
                const href = `https://${d.domain}/`;
                return (
                  <tr key={d.domain}>
                    <td>
                      <a className="domain-link" href={href}>
                        {name}
                        <span className="tld">{tld}</span>
                      </a>
                      {d.tagline && <span className="domain-sub">{d.tagline}</span>}
                    </td>
                    <td className="hide-sm">
                      {d.category && <span className="pill purple">{d.category}</span>}
                    </td>
                    <td className="price-cell">{d.priceLabel ?? "Make an offer"}</td>
                    <td className="hide-sm">
                      <span className="pill ok">
                        <span className="dot" aria-hidden="true" />
                        Available
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <a className="row-action" href={href}>
                        View →
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

import type { DomainRow, OfferRow } from "./db";
import { getDb } from "./db";

export type { DomainRow, OfferRow };

/** All domains, ordered by status then name. */
export function listDomains(): DomainRow[] {
  return getDb()
    .prepare(
      `SELECT * FROM domains ORDER BY
         CASE status WHEN 'for_sale' THEN 0 WHEN 'hold' THEN 1 WHEN 'sold' THEN 2 ELSE 3 END,
         domain ASC`,
    )
    .all() as DomainRow[];
}

export function listForSale(): DomainRow[] {
  return getDb()
    .prepare(`SELECT * FROM domains WHERE status = 'for_sale' ORDER BY domain ASC`)
    .all() as DomainRow[];
}

export function getDomain(domain: string): DomainRow | undefined {
  return getDb().prepare(`SELECT * FROM domains WHERE domain = ?`).get(domain) as
    | DomainRow
    | undefined;
}

export function getDomainById(id: number): DomainRow | undefined {
  return getDb().prepare(`SELECT * FROM domains WHERE id = ?`).get(id) as
    | DomainRow
    | undefined;
}

export interface DomainInput {
  domain: string;
  status: string;
  price: number | null;
  min_offer: number | null;
  category: string | null;
  tagline: string | null;
  notes: string | null;
  registrar: string | null;
  expires_on: string | null;
}

export function upsertDomain(input: DomainInput): number {
  const existing = getDomain(input.domain);
  if (existing) {
    getDb()
      .prepare(
        `UPDATE domains SET status = ?, price = ?, min_offer = ?, category = ?, tagline = ?,
           notes = ?, registrar = ?, expires_on = ?, updated_at = datetime('now') WHERE id = ?`,
      )
      .run(
        input.status,
        input.price,
        input.min_offer,
        input.category,
        input.tagline,
        input.notes,
        input.registrar,
        input.expires_on,
        existing.id,
      );
    return existing.id;
  }
  const result = getDb()
    .prepare(
      `INSERT INTO domains (domain, status, price, min_offer, category, tagline, notes, registrar, expires_on)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      input.domain,
      input.status,
      input.price,
      input.min_offer,
      input.category,
      input.tagline,
      input.notes,
      input.registrar,
      input.expires_on,
    );
  return Number(result.lastInsertRowid);
}

export function deleteDomain(id: number): void {
  getDb().prepare(`DELETE FROM domains WHERE id = ?`).run(id);
}

export function categories(): string[] {
  const rows = getDb()
    .prepare(
      `SELECT DISTINCT category FROM domains WHERE status = 'for_sale' AND category IS NOT NULL AND category <> '' ORDER BY category ASC`,
    )
    .all() as { category: string }[];
  return rows.map((r) => r.category);
}

/** Offers */

export interface OfferInput {
  domain: string;
  name: string;
  email: string;
  amount: number | null;
  message: string | null;
  ip: string | null;
  userAgent: string | null;
}

export function createOffer(input: OfferInput): number {
  const result = getDb()
    .prepare(
      `INSERT INTO offers (domain, name, email, amount, message, ip, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      input.domain,
      input.name,
      input.email,
      input.amount,
      input.message,
      input.ip,
      input.userAgent,
    );
  return Number(result.lastInsertRowid);
}

export function listOffers(status?: string): OfferRow[] {
  if (status) {
    return getDb()
      .prepare(`SELECT * FROM offers WHERE status = ? ORDER BY created_at DESC`)
      .all(status) as OfferRow[];
  }
  return getDb()
    .prepare(`SELECT * FROM offers ORDER BY created_at DESC`)
    .all() as OfferRow[];
}

export function setOfferStatus(id: number, status: string): void {
  getDb().prepare(`UPDATE offers SET status = ? WHERE id = ?`).run(status, id);
}

export function countOffersByStatus(): Record<string, number> {
  const rows = getDb()
    .prepare(`SELECT status, COUNT(*) AS n FROM offers GROUP BY status`)
    .all() as { status: string; n: number }[];
  const out: Record<string, number> = {};
  for (const r of rows) out[r.status] = r.n;
  return out;
}

/** Visits */

const BOT_PATTERN = /bot|crawl|spider|slurp|mediapartners|facebookexternalhit|preview|pingdom|uptimerobot/i;

export function isBot(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false;
  return BOT_PATTERN.test(userAgent);
}

export function recordVisit(
  domain: string,
  path: string,
  referrer: string | null,
  userAgent: string | null,
): void {
  if (isBot(userAgent)) return;
  getDb()
    .prepare(`INSERT INTO visits (domain, path, referrer, user_agent) VALUES (?, ?, ?, ?)`)
    .run(domain, path, referrer, userAgent);
}

export function visitsLast30Days(): number {
  const row = getDb()
    .prepare(`SELECT COUNT(*) AS n FROM visits WHERE created_at >= datetime('now', '-30 days')`)
    .get() as { n: number };
  return row.n;
}

export function visitsByDomain(): { domain: string; total: number; last30: number }[] {
  return getDb()
    .prepare(
      `SELECT domain,
              COUNT(*) AS total,
              SUM(CASE WHEN created_at >= datetime('now', '-30 days') THEN 1 ELSE 0 END) AS last30
       FROM visits GROUP BY domain ORDER BY total DESC`,
    )
    .all() as { domain: string; total: number; last30: number }[];
}

export function countDomainsByStatus(): Record<string, number> {
  const rows = getDb()
    .prepare(`SELECT status, COUNT(*) AS n FROM domains GROUP BY status`)
    .all() as { status: string; n: number }[];
  const out: Record<string, number> = {};
  for (const r of rows) out[r.status] = r.n;
  return out;
}

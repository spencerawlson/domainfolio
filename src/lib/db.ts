import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

let db: Database.Database | null = null;

/** Absolute directory holding domainfolio.sqlite. Overridable via DATA_DIR. */
export function dataDir(): string {
  const dir = process.env.DATA_DIR || path.join(process.cwd(), "data");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS domains (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  domain TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'draft',
  price REAL NULL,
  min_offer REAL NULL,
  category TEXT NULL,
  tagline TEXT NULL,
  notes TEXT NULL,
  registrar TEXT NULL,
  expires_on TEXT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_domains_status ON domains(status);

CREATE TABLE IF NOT EXISTS offers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  domain TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  amount REAL NULL,
  message TEXT NULL,
  ip TEXT NULL,
  user_agent TEXT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  status TEXT NOT NULL DEFAULT 'new'
);
CREATE INDEX IF NOT EXISTS idx_offers_domain ON offers(domain);
CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(status);

CREATE TABLE IF NOT EXISTS visits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  domain TEXT NOT NULL,
  path TEXT NOT NULL,
  referrer TEXT NULL,
  user_agent TEXT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_visits_domain ON visits(domain);
CREATE INDEX IF NOT EXISTS idx_visits_created ON visits(created_at);
`;

/** Lazily open the SQLite database, creating tables on first use. */
export function getDb(): Database.Database {
  if (!db) {
    const file = path.join(dataDir(), "domainfolio.sqlite");
    db = new Database(file);
    db.pragma("journal_mode = WAL");
    db.exec(SCHEMA);
  }
  return db;
}

export type DomainStatus = "draft" | "for_sale" | "sold" | "hold";

export interface DomainRow {
  id: number;
  domain: string;
  status: DomainStatus;
  price: number | null;
  min_offer: number | null;
  category: string | null;
  tagline: string | null;
  notes: string | null;
  registrar: string | null;
  expires_on: string | null;
  created_at: string;
  updated_at: string;
}

export interface OfferRow {
  id: number;
  domain: string;
  name: string;
  email: string;
  amount: number | null;
  message: string | null;
  ip: string | null;
  user_agent: string | null;
  created_at: string;
  status: "new" | "read" | "handled" | "dismissed";
}

export interface VisitRow {
  id: number;
  domain: string;
  path: string;
  referrer: string | null;
  user_agent: string | null;
  created_at: string;
}

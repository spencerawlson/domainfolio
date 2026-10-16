/**
 * npm run seed — create the database tables and insert clearly-sample listings
 * so every page type (catalog, lander, sold, not-listed) can be smoke-tested.
 * These names are invented placeholders; replace them with your own inventory.
 */
import { getDb } from "../src/lib/db";
import { upsertDomain } from "../src/lib/inventory";

const SAMPLES = [
  {
    domain: "bluemeadow.com",
    status: "for_sale",
    price: 2400,
    min_offer: 1500,
    lease_months: 24,
    category: "Brandable",
    tagline: "A calm, memorable name for a wellness or outdoor brand.",
    notes: "Sample listing",
    registrar: "ExampleRegistrar",
    expires_on: "2027-05-01",
  },
  {
    domain: "cartnova.com",
    status: "for_sale",
    price: 1850,
    min_offer: 1000,
    lease_months: null,
    category: "E-commerce",
    tagline: "A punchy name for a shop, marketplace, or checkout tool.",
    notes: "Sample listing",
    registrar: "ExampleRegistrar",
    expires_on: "2027-02-14",
  },
  {
    domain: "getpilotly.com",
    status: "for_sale",
    price: null,
    min_offer: 800,
    lease_months: null,
    category: "SaaS",
    tagline: "Perfect for a trial-management or onboarding platform.",
    notes: "Sample listing (make-an-offer)",
    registrar: "ExampleRegistrar",
    expires_on: "2027-08-20",
  },
  {
    domain: "brightquill.io",
    status: "sold",
    price: 1200,
    min_offer: null,
    lease_months: null,
    category: "Brandable",
    tagline: "A writer-focused name that already found its owner.",
    notes: "Sample listing (sold, for the sold page)",
    registrar: "ExampleRegistrar",
    expires_on: "2026-11-30",
  },
];

getDb(); // ensure tables exist
for (const s of SAMPLES) {
  upsertDomain(s);
  console.log(`seeded: ${s.domain} (${s.status})`);
}
console.log("Done.");

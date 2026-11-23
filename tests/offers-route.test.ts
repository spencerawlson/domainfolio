import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "../src/app/api/offers/route";
import { listOffers, upsertDomain } from "../src/lib/inventory";

// Isolated SQLite file for this test file only; getDb() is lazy, so setting
// DATA_DIR here takes effect before the first database call.
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "domainfolio-test-"));
process.env.DATA_DIR = tmpDir;

afterAll(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

upsertDomain({
  domain: "minoffer.test",
  status: "for_sale",
  price: 3000,
  min_offer: 1500,
  lease_months: null,
  category: null,
  tagline: null,
  notes: null,
  registrar: null,
  expires_on: null,
});

function offerRequest(ip: string, amount: number | null): NextRequest {
  return new NextRequest("http://localhost/api/offers", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      // Forged X-Forwarded-For must NOT win over CF-Connecting-IP.
      "cf-connecting-ip": ip,
      "x-forwarded-for": "1.2.3.4",
    },
    body: JSON.stringify({
      domain: "minoffer.test",
      name: "Jane Buyer",
      email: "jane@example.com",
      amount,
      message: "Interested.",
    }),
  });
}

describe("POST /api/offers minimum-offer enforcement", () => {
  it("rejects an offer below the minimum and stores nothing", async () => {
    const res = await POST(offerRequest("203.0.113.201", 1));
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error?: string };
    expect(body.error).toMatch(/minimum offer for minoffer\.test is \$1,500/);
    expect(listOffers()).toHaveLength(0);
  });

  it("accepts an offer at the minimum and records the CF IP, not the forged one", async () => {
    const res = await POST(offerRequest("203.0.113.202", 1500));
    expect(res.status).toBe(200);
    const stored = listOffers();
    expect(stored).toHaveLength(1);
    expect(stored[0].amount).toBe(1500);
    expect(stored[0].ip).toBe("203.0.113.202");
  });

  it("accepts an offer with no stated amount (expression of interest)", async () => {
    const res = await POST(offerRequest("203.0.113.203", null));
    expect(res.status).toBe(200);
    expect(listOffers()).toHaveLength(2);
  });
});

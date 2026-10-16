import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { seeOther } from "@/lib/http";
import { upsertDomain } from "@/lib/inventory";

export const runtime = "nodejs";

function toNumberOrNull(v: FormDataEntryValue | null): number | null {
  if (v === null) return null;
  const s = String(v).trim();
  if (s === "") return null;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

/** Lease-to-own term in whole months (1–120), or null when unset/invalid. */
function toLeaseMonthsOrNull(v: FormDataEntryValue | null): number | null {
  const n = toNumberOrNull(v);
  return n !== null && Number.isInteger(n) && n >= 1 && n <= 120 ? n : null;
}

/** Create or update a domain (form posts from the admin UI). */
export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const form = await request.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid form." }, { status: 400 });

  const action = String(form.get("action") || "save");
  const domain = String(form.get("domain") || "").trim().toLowerCase();
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/.test(domain)) {
    return seeOther("/admin/domains?error=domain");
  }

  // The "Add" form must never overwrite an existing listing: it posts every field,
  // so re-adding a domain would blank its price, tagline, etc.
  if (action === "add") {
    const { getDomain } = await import("@/lib/inventory");
    if (getDomain(domain)) return seeOther("/admin/domains?error=exists");
  }

  if (action === "delete") {
    const { getDomain, deleteDomain } = await import("@/lib/inventory");
    const existing = getDomain(domain);
    if (existing) deleteDomain(existing.id);
  } else {
    const status = String(form.get("status") || "draft");
    if (!["draft", "for_sale", "sold", "hold"].includes(status)) {
      return seeOther("/admin/domains?error=status");
    }
    upsertDomain({
      domain,
      status,
      price: toNumberOrNull(form.get("price")),
      min_offer: toNumberOrNull(form.get("min_offer")),
      lease_months: toLeaseMonthsOrNull(form.get("lease_months")),
      category: String(form.get("category") || "").trim() || null,
      tagline: String(form.get("tagline") || "").trim() || null,
      notes: String(form.get("notes") || "").trim() || null,
      registrar: String(form.get("registrar") || "").trim() || null,
      expires_on: String(form.get("expires_on") || "").trim() || null,
    });
  }

  return seeOther("/admin/domains");
}

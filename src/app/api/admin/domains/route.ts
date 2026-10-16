import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { upsertDomain } from "@/lib/inventory";

export const runtime = "nodejs";

function toNumberOrNull(v: FormDataEntryValue | null): number | null {
  if (v === null) return null;
  const s = String(v).trim();
  if (s === "") return null;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? n : null;
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
    return NextResponse.redirect(new URL("/admin/domains?error=domain", request.url), 303);
  }

  if (action === "delete") {
    const { getDomain, deleteDomain } = await import("@/lib/inventory");
    const existing = getDomain(domain);
    if (existing) deleteDomain(existing.id);
  } else {
    const status = String(form.get("status") || "draft");
    if (!["draft", "for_sale", "sold", "hold"].includes(status)) {
      return NextResponse.redirect(new URL("/admin/domains?error=status", request.url), 303);
    }
    upsertDomain({
      domain,
      status,
      price: toNumberOrNull(form.get("price")),
      min_offer: toNumberOrNull(form.get("min_offer")),
      category: String(form.get("category") || "").trim() || null,
      tagline: String(form.get("tagline") || "").trim() || null,
      notes: String(form.get("notes") || "").trim() || null,
      registrar: String(form.get("registrar") || "").trim() || null,
      expires_on: String(form.get("expires_on") || "").trim() || null,
    });
  }

  return NextResponse.redirect(new URL("/admin/domains", request.url), 303);
}

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { setOfferStatus } from "@/lib/inventory";

export const runtime = "nodejs";

/** Change an offer's status (form posts from the offers inbox). */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const { id } = await params;
  const form = await request.formData().catch(() => null);
  const status = form ? String(form.get("status") || "") : "";
  if (!["new", "read", "handled", "dismissed"].includes(status) || !/^\d+$/.test(id)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  setOfferStatus(Number(id), status);
  const back = new URL("/admin/offers", request.url);
  return NextResponse.redirect(back, 303);
}

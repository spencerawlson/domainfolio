import { NextRequest, NextResponse } from "next/server";
import { createOffer, getDomain } from "@/lib/inventory";
import { clientIpFromHeaders } from "@/lib/client-ip";
import { notifyOffer } from "@/lib/mail";
import { checkRateLimit } from "@/lib/ratelimit";
import { enforceMinimumOffer, validateOffer } from "@/lib/validation";

export const runtime = "nodejs";

/** Receive an offer on a listed domain. Honeypot bots get a fake success. */
export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  let offer;
  try {
    offer = validateOffer((payload || {}) as Record<string, unknown>);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Invalid offer." },
      { status: 400 },
    );
  }

  if (offer.isBot) {
    // Pretend the submission worked; do not store anything.
    return NextResponse.json({ ok: true });
  }

  const record = getDomain(offer.domain);
  if (!record || record.status !== "for_sale") {
    return NextResponse.json({ error: "That domain is not listed for sale." }, { status: 400 });
  }

  // Minimum offer is enforced server-side (it used to be display-only).
  // Checked before the rate limit so a rejected offer does not consume
  // the buyer's 5/hour budget. The minimum is already shown on the
  // lander page, so the error message leaks nothing new.
  try {
    enforceMinimumOffer(offer.amount, record.min_offer, record.domain);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Offer is below the minimum." },
      { status: 400 },
    );
  }

  const ip = clientIpFromHeaders(request.headers);
  if (!checkRateLimit(`offer:${ip}`)) {
    return NextResponse.json(
      { error: "Too many offers from your connection. Please try again later." },
      { status: 429 },
    );
  }

  createOffer({
    domain: offer.domain,
    name: offer.name,
    email: offer.email,
    amount: offer.amount,
    message: offer.message,
    ip,
    userAgent: request.headers.get("user-agent"),
  });

  // Best-effort: never fail the request if email is down or unconfigured.
  await notifyOffer(offer);

  return NextResponse.json({ ok: true });
}

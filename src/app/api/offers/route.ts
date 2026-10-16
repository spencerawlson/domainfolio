import { NextRequest, NextResponse } from "next/server";
import { createOffer, getDomain } from "@/lib/inventory";
import { notifyOffer } from "@/lib/mail";
import { checkRateLimit } from "@/lib/ratelimit";
import { validateOffer } from "@/lib/validation";

export const runtime = "nodejs";

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

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

  const ip = clientIp(request);
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

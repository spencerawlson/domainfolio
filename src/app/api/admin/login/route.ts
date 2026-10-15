import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createSession, SESSION_COOKIE } from "@/lib/auth";

export const runtime = "nodejs";

function timingSafeEqualStrings(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

/** Exchange the admin password for a signed httpOnly session cookie. */
export async function POST(request: NextRequest) {
  const form = await request.formData().catch(() => null);
  const password = form ? String(form.get("password") || "") : "";
  const expected = process.env.ADMIN_PASSWORD || "";

  if (expected === "" || !process.env.SESSION_SECRET) {
    return NextResponse.redirect(new URL("/admin/login?error=config", request.url), 303);
  }

  const ok = timingSafeEqualStrings(password, expected);

  if (!ok) {
    return NextResponse.redirect(new URL("/admin/login?error=1", request.url), 303);
  }

  const { value, maxAge } = createSession();
  const response = NextResponse.redirect(new URL("/admin", request.url), 303);
  response.cookies.set(SESSION_COOKIE, value, {
    httpOnly: true,
    path: "/",
    maxAge,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}

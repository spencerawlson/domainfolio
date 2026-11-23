import crypto from "node:crypto";
import { NextRequest } from "next/server";
import { createSession, SESSION_COOKIE } from "@/lib/auth";
import { clientIpFromHeaders } from "@/lib/client-ip";
import { seeOther } from "@/lib/http";
import { checkRateLimit, resetRateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";

// Brute-force protection for the single shared admin password: 10 attempts
// per 15 minutes per client IP. A successful login clears the counter, so a
// legitimate admin is never locked out by earlier typos. Failures are logged
// server-side (IP + time); there is no persistent audit log yet.
const LOGIN_MAX_ATTEMPTS = 10;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

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
    return seeOther("/admin/login?error=config");
  }

  const ip = clientIpFromHeaders(request.headers);
  const limitKey = `admin-login:${ip}`;
  if (!checkRateLimit(limitKey, LOGIN_MAX_ATTEMPTS, LOGIN_WINDOW_MS)) {
    console.warn(
      `[admin-login] rate-limited ${ip} at ${new Date().toISOString()} ` +
        `(${LOGIN_MAX_ATTEMPTS} attempts in ${LOGIN_WINDOW_MS / 60000} min)`,
    );
    return seeOther("/admin/login?error=ratelimited");
  }

  const ok = timingSafeEqualStrings(password, expected);

  if (!ok) {
    console.warn(`[admin-login] failed attempt from ${ip} at ${new Date().toISOString()}`);
    return seeOther("/admin/login?error=1");
  }

  // A correct password clears any earlier failed attempts from this IP.
  resetRateLimit(limitKey);

  const { value, maxAge } = createSession();
  const response = seeOther("/admin");
  response.cookies.set(SESSION_COOKIE, value, {
    httpOnly: true,
    path: "/",
    maxAge,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}

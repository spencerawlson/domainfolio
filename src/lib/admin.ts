import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession } from "./auth";

/** Guard for admin API routes. Returns null when the session is valid. */
export function requireAdmin(request: NextRequest): NextResponse | null {
  const session = request.cookies.get(SESSION_COOKIE)?.value;
  if (!verifySession(session)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return null;
}

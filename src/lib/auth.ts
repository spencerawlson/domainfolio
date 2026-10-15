import crypto from "node:crypto";

export const SESSION_COOKIE = "df_admin";
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

function sessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not configured.");
  return secret;
}

function signature(payload: string): string {
  return crypto.createHmac("sha256", sessionSecret()).update(payload).digest("hex");
}

/** Create a signed session cookie value valid for 7 days. */
export function createSession(): { value: string; maxAge: number } {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `admin:${exp}`;
  const value = `${exp}.${signature(payload)}`;
  return { value, maxAge: SESSION_TTL_SECONDS };
}

/** Verify a session cookie value. */
export function verifySession(value: string | undefined | null): boolean {
  // Unconfigured secret means no session can be valid; send to login rather than crash.
  if (!value || !process.env.SESSION_SECRET) return false;
  const [expStr, sig] = value.split(".");
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return false;
  if (!sig) return false;
  const expected = signature(`admin:${exp}`);
  try {
    return crypto.timingSafeEqual(Buffer.from(sig, "utf8"), Buffer.from(expected, "utf8"));
  } catch {
    return false;
  }
}

/**
 * Best-effort client IP for rate limiting and audit logging. Pure — safe to
 * unit test.
 *
 * Behind the Cloudflare Tunnel, `CF-Connecting-IP` is set by Cloudflare to
 * the real client IP and cannot be forged by the client, so it is the
 * authoritative source. Only when it is absent (direct or local access)
 * fall back to the first `X-Forwarded-For` entry, then `X-Real-IP`.
 *
 * Previously the offers route trusted the first `X-Forwarded-For` entry,
 * which any client can forge — rotating the header defeated the rate limit
 * and the forged value was stored as the offer's IP.
 */
export function clientIpFromHeaders(headers: Headers): string {
  const cf = headers.get("cf-connecting-ip");
  if (cf && cf.trim() !== "") return cf.trim();
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0].trim();
    if (first !== "") return first;
  }
  const real = headers.get("x-real-ip");
  if (real && real.trim() !== "") return real.trim();
  return "unknown";
}

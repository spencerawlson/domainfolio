const hits = new Map<string, number[]>();

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_HITS = 5;

/**
 * In-memory per-key rate limiter. Returns true when the request may proceed,
 * false when it must be rejected. Window: MAX_HITS per WINDOW_MS per key.
 */
export function checkRateLimit(key: string, limit = MAX_HITS, windowMs = WINDOW_MS): boolean {
  const now = Date.now();
  const previous = hits.get(key) ?? [];
  const recent = previous.filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}

/** Test hook: reset a key's history. */
export function resetRateLimit(key: string): void {
  hits.delete(key);
}

export type RouteDecision =
  | { type: "portfolio" }
  | { type: "lander"; domain: string }
  | { type: "sold"; domain: string }
  | { type: "hold"; domain: string }
  | { type: "unknown"; host: string };

export type DomainStatus = "for_sale" | "sold" | "hold" | "draft" | string;

/** Normalize a Host header: lowercase, strip port, strip a single leading "www.". */
export function normalizeHost(host: string | null | undefined): string {
  let h = (host || "").trim().toLowerCase();
  h = h.split(":")[0];
  if (h.startsWith("www.")) h = h.slice(4);
  return h;
}

export interface RouteContext {
  /** The portfolio's own host, e.g. "domains.example.com" or "localhost". */
  portfolioHost: string;
  /** Inventory lookup by normalized domain. Returns the domain's status. */
  lookup: (domain: string) => DomainStatus | null;
}

/**
 * Decide how to route a request purely from its Host header and the inventory.
 * Kept free of Next.js / database imports so it is unit-testable; middleware
 * supplies the lookup backed by SQLite.
 */
export function routeHost(rawHost: string | null | undefined, ctx: RouteContext): RouteDecision {
  const host = normalizeHost(rawHost);
  if (!host) return { type: "unknown", host: "" };
  if (host === normalizeHost(ctx.portfolioHost)) return { type: "portfolio" };

  const status = ctx.lookup(host);
  switch (status) {
    case "for_sale":
      return { type: "lander", domain: host };
    case "sold":
      return { type: "sold", domain: host };
    case "hold":
      return { type: "hold", domain: host };
    default:
      return { type: "unknown", host };
  }
}

/** Admin UI and admin API paths. */
export function isAdminPath(pathname: string): boolean {
  return /^\/(api\/)?admin(\/|$)/.test(pathname);
}

/**
 * Admin is served only on the portfolio host (plus loopback, for SSH-tunnel
 * access on the server), never on a lander domain.
 */
export function adminAllowedOnHost(rawHost: string | null | undefined, portfolioHost: string): boolean {
  const host = normalizeHost(rawHost);
  return host === normalizeHost(portfolioHost) || host === "localhost" || host === "127.0.0.1";
}

/** Destination path for a routing decision (used by middleware rewrites). */
export function rewritePath(decision: RouteDecision): string | null {
  switch (decision.type) {
    case "portfolio":
      return null; // no rewrite
    case "lander":
      return `/lander/${decision.domain}`;
    case "sold":
      return `/sold/${decision.domain}`;
    case "hold":
      return `/hold/${decision.domain}`;
    case "unknown":
      return "/not-listed";
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "./lib/db";
import { adminAllowedOnHost, isAdminPath, rewritePath, routeHost } from "./lib/routing";

// Needs the Node runtime: routing reads the inventory from SQLite (better-sqlite3).
export const runtime = "nodejs";

function portfolioHost(): string {
  return (process.env.PORTFOLIO_HOST || "localhost").trim().toLowerCase();
}

export function middleware(request: NextRequest) {
  const rawHost = request.headers.get("host");
  const { pathname } = request.nextUrl;

  // Admin lives on the portfolio host only; lander domains get a plain 404.
  if (isAdminPath(pathname)) {
    if (adminAllowedOnHost(rawHost, portfolioHost())) return NextResponse.next();
    return new NextResponse("Not found", { status: 404 });
  }

  // Public API (offers from lander forms, health checks) works on every host.
  if (pathname.startsWith("/api/")) return NextResponse.next();

  const db = getDb();
  const decision = routeHost(rawHost, {
    portfolioHost: portfolioHost(),
    lookup: (domain: string) => {
      const row = db
        .prepare(`SELECT status FROM domains WHERE domain = ?`)
        .get(domain) as { status: string } | undefined;
      return row ? row.status : null;
    },
  });

  const target = rewritePath(decision);
  if (!target) return NextResponse.next();

  // Hand the landed domain to the page so it can render without re-reading host.
  const response = NextResponse.rewrite(new URL(target, request.url));
  if (decision.type === "lander" || decision.type === "sold" || decision.type === "hold") {
    response.headers.set("x-domainfolio-domain", decision.domain);
  }
  return response;
}

export const config = {
  // Everything except static assets runs through the middleware; admin and API
  // paths are handled explicitly above.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

import { NextResponse } from "next/server";

/**
 * 303 See Other to a same-site path, sent as a *relative* Location header.
 *
 * Don't build redirects from `request.url`: behind the Cloudflare tunnel the
 * standalone server sees its bind address (http://0.0.0.0:3000), so absolute
 * redirects sent browsers to https://0.0.0.0:3000/... . A relative Location is
 * resolved by the browser against the host it actually used (RFC 9110 §10.2.2).
 */
export function seeOther(path: string): NextResponse {
  if (!path.startsWith("/") || path.startsWith("//")) {
    throw new Error(`seeOther expects a same-site path, got: ${path}`);
  }
  return new NextResponse(null, { status: 303, headers: { Location: path } });
}

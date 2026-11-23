import { describe, expect, it } from "vitest";
import { clientIpFromHeaders } from "../src/lib/client-ip";

function headers(entries: Record<string, string>): Headers {
  return new Headers(entries);
}

describe("clientIpFromHeaders", () => {
  it("prefers CF-Connecting-IP over a forged X-Forwarded-For", () => {
    const ip = clientIpFromHeaders(
      headers({
        "cf-connecting-ip": "203.0.113.7",
        "x-forwarded-for": "1.2.3.4, 5.6.7.8",
      }),
    );
    expect(ip).toBe("203.0.113.7");
  });

  it("falls back to the first X-Forwarded-For entry when CF header is absent", () => {
    const ip = clientIpFromHeaders(
      headers({ "x-forwarded-for": "1.2.3.4, 5.6.7.8", "x-real-ip": "9.9.9.9" }),
    );
    expect(ip).toBe("1.2.3.4");
  });

  it("falls back to X-Real-IP when both CF and X-Forwarded-For are absent", () => {
    expect(clientIpFromHeaders(headers({ "x-real-ip": "9.9.9.9" }))).toBe("9.9.9.9");
  });

  it("returns unknown when no IP header is present", () => {
    expect(clientIpFromHeaders(headers({}))).toBe("unknown");
  });

  it("ignores an empty CF-Connecting-IP and trims whitespace", () => {
    const ip = clientIpFromHeaders(
      headers({ "cf-connecting-ip": "   ", "x-forwarded-for": "  1.2.3.4  " }),
    );
    expect(ip).toBe("1.2.3.4");
  });
});

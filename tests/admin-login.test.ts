import { afterEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "../src/app/api/admin/login/route";
import { resetRateLimit } from "../src/lib/ratelimit";

// The route reads these at request time; no real secret is involved.
process.env.ADMIN_PASSWORD = "test-admin-password";
process.env.SESSION_SECRET = "test-session-secret-for-unit-tests-only";

function loginRequest(ip: string, password: string): NextRequest {
  const fd = new FormData();
  fd.append("password", password);
  return new NextRequest("http://localhost/api/admin/login", {
    method: "POST",
    headers: { "cf-connecting-ip": ip },
    body: fd,
  });
}

describe("POST /api/admin/login rate limiting", () => {
  const ips: string[] = [];
  afterEach(() => {
    for (const ip of ips.splice(0)) resetRateLimit(`admin-login:${ip}`);
  });

  it("rejects a wrong password with ?error=1", async () => {
    const ip = "203.0.113.101";
    ips.push(ip);
    const res = await POST(loginRequest(ip, "wrong-password"));
    expect(res.status).toBe(303);
    expect(res.headers.get("Location")).toBe("/admin/login?error=1");
  });

  it("rate-limits after 10 failed attempts in 15 minutes", async () => {
    const ip = "203.0.113.102";
    ips.push(ip);
    for (let i = 0; i < 10; i++) {
      const res = await POST(loginRequest(ip, "wrong-password"));
      expect(res.headers.get("Location")).toBe("/admin/login?error=1");
    }
    const limited = await POST(loginRequest(ip, "wrong-password"));
    expect(limited.status).toBe(303);
    expect(limited.headers.get("Location")).toBe("/admin/login?error=ratelimited");
  });

  it("accepts the correct password and clears the failure counter", async () => {
    const ip = "203.0.113.103";
    ips.push(ip);
    await POST(loginRequest(ip, "wrong-password"));
    await POST(loginRequest(ip, "wrong-password"));
    const ok = await POST(loginRequest(ip, "test-admin-password"));
    expect(ok.status).toBe(303);
    expect(ok.headers.get("Location")).toBe("/admin");
    expect(ok.cookies.get("df_admin")).toBeDefined();
    // Counter cleared: 10 more failures are allowed before limiting.
    for (let i = 0; i < 10; i++) {
      const res = await POST(loginRequest(ip, "wrong-password"));
      expect(res.headers.get("Location")).toBe("/admin/login?error=1");
    }
  });
});

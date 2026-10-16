import { describe, expect, it } from "vitest";
import { seeOther } from "../src/lib/http";

describe("seeOther", () => {
  it("redirects with a relative Location so the browser keeps its own host", () => {
    const res = seeOther("/admin/domains?error=domain");
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe("/admin/domains?error=domain");
  });

  it("can carry cookies (login sets the session on the redirect)", () => {
    const res = seeOther("/admin");
    res.cookies.set("df_admin", "x", { httpOnly: true, path: "/" });
    expect(res.headers.get("set-cookie")).toContain("df_admin=x");
  });

  it("rejects absolute and protocol-relative targets", () => {
    expect(() => seeOther("https://0.0.0.0:3000/admin")).toThrow();
    expect(() => seeOther("//evil.example/admin")).toThrow();
  });
});

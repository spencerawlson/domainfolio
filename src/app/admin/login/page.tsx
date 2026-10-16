import { LogoMark } from "@/components/LogoMark";

interface Props {
  searchParams: Promise<{ error?: string }>;
}

const NAME = process.env.PORTFOLIO_NAME || "Domainfolio";

export default async function AdminLogin({ searchParams }: Props) {
  const { error } = await searchParams;
  return (
    <main style={{ display: "grid", placeItems: "center", minHeight: "100vh", padding: "1.25rem" }}>
      <div className="card" style={{ width: "100%", maxWidth: "400px", padding: "2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.9rem" }}>
            <LogoMark size={40} />
          </div>
          <h1 style={{ fontSize: "1.35rem", marginBottom: "0.25rem" }}>{NAME} Admin</h1>
          <p className="muted mono" style={{ margin: 0, fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Operator access only
          </p>
        </div>
        {error && (
          <div className="error" role="alert">
            {error === "config"
              ? "Admin sign-in is not configured. Set ADMIN_PASSWORD and SESSION_SECRET in .env."
              : "Wrong password. Please try again."}
          </div>
        )}
        <form method="POST" action="/api/admin/login">
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>
          <button className="btn block" type="submit">
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}

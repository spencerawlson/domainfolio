interface Props {
  searchParams: Promise<{ error?: string }>;
}

export default async function AdminLogin({ searchParams }: Props) {
  const { error } = await searchParams;
  return (
    <main style={{ maxWidth: "420px" }}>
      <h1>Admin sign in</h1>
      {error && (
        <div className="error" role="alert">
          Wrong password. Please try again.
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
        <button className="btn" type="submit">
          Sign in
        </button>
      </form>
    </main>
  );
}

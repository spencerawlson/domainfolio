import { AdminNav } from "@/components/AdminNav";
import { listOffers } from "@/lib/inventory";

const FILTERS = ["all", "new", "read", "handled", "dismissed"] as const;

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminOffers({ searchParams }: Props) {
  const { status } = await searchParams;
  const filter = FILTERS.includes(status as (typeof FILTERS)[number]) ? status! : "all";
  const offers = filter === "all" ? listOffers() : listOffers(filter);

  return (
    <>
      <AdminNav />
      <main>
        <h1>Offers</h1>
        <div className="toolbar">
          {FILTERS.map((f) => (
            <a
              key={f}
              href={f === "all" ? "/admin/offers" : `/admin/offers?status=${f}`}
              className="badge"
              style={f === filter ? { background: "var(--accent)", color: "#fff" } : {}}
            >
              {f}
            </a>
          ))}
        </div>
        {offers.length === 0 ? (
          <p className="muted">No offers here yet.</p>
        ) : (
          offers.map((o) => (
            <article key={o.id} className="card" style={{ marginBottom: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                <strong style={{ fontSize: "1.1rem" }}>{o.domain}</strong>
                <span className={`badge ${o.status}`}>{o.status}</span>
              </div>
              <p>
                {o.name} &lt;{o.email}&gt; ·{" "}
                <strong>{o.amount !== null ? `$${o.amount.toLocaleString("en-US")}` : "no amount"}</strong>
              </p>
              {o.message && (
                <blockquote style={{ borderLeft: "3px solid var(--line)", margin: "0 0 1rem", paddingLeft: "1rem" }}>
                  {o.message}
                </blockquote>
              )}
              <p className="muted" style={{ fontSize: "0.85rem" }}>
                Received {o.created_at.replace("T", " ").slice(0, 16)}
              </p>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {(["read", "handled", "dismissed"] as const).map((s) => (
                  <form key={s} method="POST" action={`/api/admin/offers/${o.id}`}>
                    <input type="hidden" name="status" value={s} />
                    <button className="btn secondary" type="submit" style={{ padding: "0.5rem 1rem" }}>
                      Mark {s}
                    </button>
                  </form>
                ))}
              </div>
            </article>
          ))
        )}
      </main>
    </>
  );
}

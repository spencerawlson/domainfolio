import Link from "next/link";
import { AdminNav } from "@/components/AdminNav";
import { DeleteDomainButton } from "@/components/DeleteDomainButton";
import { listDomains } from "@/lib/inventory";
import { formatPrice } from "@/lib/pricing";

const STATUSES = ["draft", "for_sale", "sold", "hold"] as const;

export default function AdminDomains() {
  const domains = listDomains();

  return (
    <>
      <AdminNav />
      <main>
        <h1>Domains</h1>

        <div className="card" style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.25rem" }}>Add or update a domain</h2>
          <form method="POST" action="/api/admin/domains">
            <input type="hidden" name="action" value="save" />
            <div className="field">
              <label htmlFor="d-domain">Domain</label>
              <input id="d-domain" name="domain" required placeholder="example.com" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="field">
                <label htmlFor="d-status">Status</label>
                <select id="d-status" name="status" defaultValue="for_sale">
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="d-category">Category</label>
                <input id="d-category" name="category" placeholder="e.g. Brandable" />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="field">
                <label htmlFor="d-price">Buy-it-now price (leave empty for make-an-offer)</label>
                <input id="d-price" name="price" type="number" min="0" step="1" />
              </div>
              <div className="field">
                <label htmlFor="d-min">Minimum offer</label>
                <input id="d-min" name="min_offer" type="number" min="0" step="1" />
              </div>
            </div>
            <div className="field">
              <label htmlFor="d-tagline">Tagline (one line shown on the lander)</label>
              <input id="d-tagline" name="tagline" maxLength={200} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="field">
                <label htmlFor="d-registrar">Registrar</label>
                <input id="d-registrar" name="registrar" />
              </div>
              <div className="field">
                <label htmlFor="d-expires">Expires on (YYYY-MM-DD)</label>
                <input id="d-expires" name="expires_on" pattern="\d{4}-\d{2}-\d{2}" />
              </div>
            </div>
            <div className="field">
              <label htmlFor="d-notes">Private notes</label>
              <textarea id="d-notes" name="notes" rows={2} />
            </div>
            <button className="btn" type="submit">
              Save domain
            </button>
          </form>
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Domain</th>
                <th>Status</th>
                <th>Price</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {domains.map((d) => (
                <tr key={d.id}>
                  <td>{d.domain}</td>
                  <td>
                    <span className={`badge ${d.status}`}>{d.status.replace("_", " ")}</span>
                  </td>
                  <td>{formatPrice(d.price) ?? "—"}</td>
                  <td>{d.category ?? "—"}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <Link href={`/admin/domains/${d.id}`}>Edit</Link>
                    {" · "}
                    <DeleteDomainButton domain={d.domain} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}

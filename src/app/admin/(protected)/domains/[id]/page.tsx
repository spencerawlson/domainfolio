import { notFound } from "next/navigation";
import { AdminNav } from "@/components/AdminNav";
import { getDomainById } from "@/lib/inventory";

const STATUSES = ["draft", "for_sale", "sold", "hold"] as const;

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditDomain({ params }: Props) {
  const { id } = await params;
  const record = /^\d+$/.test(id) ? getDomainById(Number(id)) : undefined;
  if (!record) notFound();

  return (
    <>
      <AdminNav />
      <main>
        <h1>Edit {record.domain}</h1>
        <div className="card">
          <form method="POST" action="/api/admin/domains">
            <input type="hidden" name="action" value="save" />
            <input type="hidden" name="domain" value={record.domain} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="field">
                <label htmlFor="e-status">Status</label>
                <select id="e-status" name="status" defaultValue={record.status}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="e-category">Category</label>
                <input id="e-category" name="category" defaultValue={record.category ?? ""} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
              <div className="field">
                <label htmlFor="e-price">Buy-it-now price</label>
                <input
                  id="e-price"
                  name="price"
                  type="number"
                  min="0"
                  step="1"
                  defaultValue={record.price ?? ""}
                />
              </div>
              <div className="field">
                <label htmlFor="e-min">Minimum offer</label>
                <input
                  id="e-min"
                  name="min_offer"
                  type="number"
                  min="0"
                  step="1"
                  defaultValue={record.min_offer ?? ""}
                />
              </div>
              <div className="field">
                <label htmlFor="e-lease">Lease-to-own months (Afternic)</label>
                <input
                  id="e-lease"
                  name="lease_months"
                  type="number"
                  min="1"
                  max="120"
                  step="1"
                  defaultValue={record.lease_months ?? ""}
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="e-tagline">Tagline</label>
              <input id="e-tagline" name="tagline" maxLength={200} defaultValue={record.tagline ?? ""} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="field">
                <label htmlFor="e-registrar">Registrar</label>
                <input id="e-registrar" name="registrar" defaultValue={record.registrar ?? ""} />
              </div>
              <div className="field">
                <label htmlFor="e-expires">Expires on</label>
                <input
                  id="e-expires"
                  name="expires_on"
                  pattern="\d{4}-\d{2}-\d{2}"
                  defaultValue={record.expires_on ?? ""}
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="e-notes">Private notes</label>
              <textarea id="e-notes" name="notes" rows={2} defaultValue={record.notes ?? ""} />
            </div>
            <button className="btn" type="submit">
              Save changes
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

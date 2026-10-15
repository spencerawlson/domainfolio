import { AdminNav } from "@/components/AdminNav";
import {
  countDomainsByStatus,
  countOffersByStatus,
  listOffers,
  visitsByDomain,
  visitsLast30Days,
} from "@/lib/inventory";

export default function AdminDashboard() {
  const byStatus = countDomainsByStatus();
  const offerCounts = countOffersByStatus();
  const visits30 = visitsLast30Days();
  const top = visitsByDomain().slice(0, 5);
  const latest = listOffers().slice(0, 5);
  const totalOffers = Object.values(offerCounts).reduce((a, b) => a + b, 0);

  const stat = (label: string, value: string | number) => (
    <div className="card" style={{ textAlign: "center" }}>
      <div style={{ fontSize: "2rem", fontWeight: 800 }}>{value}</div>
      <div className="muted">{label}</div>
    </div>
  );

  return (
    <>
      <AdminNav />
      <main>
        <h1>Dashboard</h1>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
          {stat("For sale", byStatus.for_sale ?? 0)}
          {stat("On hold", byStatus.hold ?? 0)}
          {stat("Sold", byStatus.sold ?? 0)}
          {stat("Draft", byStatus.draft ?? 0)}
          {stat("New offers", offerCounts.new ?? 0)}
          {stat("All offers", totalOffers)}
          {stat("Visits, last 30 days", visits30)}
        </div>

        <h2 style={{ marginTop: "2.5rem" }}>Most visited domains</h2>
        {top.length === 0 ? (
          <p className="muted">No visits recorded yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Domain</th>
                  <th>Total visits</th>
                  <th>Last 30 days</th>
                </tr>
              </thead>
              <tbody>
                {top.map((t) => (
                  <tr key={t.domain}>
                    <td>{t.domain}</td>
                    <td>{t.total}</td>
                    <td>{t.last30}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <h2 style={{ marginTop: "2.5rem" }}>Latest offers</h2>
        {latest.length === 0 ? (
          <p className="muted">No offers yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Domain</th>
                  <th>From</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Received</th>
                </tr>
              </thead>
              <tbody>
                {latest.map((o) => (
                  <tr key={o.id}>
                    <td>{o.domain}</td>
                    <td>
                      {o.name} <span className="muted">&lt;{o.email}&gt;</span>
                    </td>
                    <td>{o.amount !== null ? `$${o.amount.toLocaleString("en-US")}` : "—"}</td>
                    <td>
                      <span className={`badge ${o.status}`}>{o.status}</span>
                    </td>
                    <td>{o.created_at.replace("T", " ").slice(0, 16)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}

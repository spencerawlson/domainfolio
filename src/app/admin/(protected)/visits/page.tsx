import { AdminNav } from "@/components/AdminNav";
import { visitsByDomain } from "@/lib/inventory";

export default function AdminVisits() {
  const rows = visitsByDomain();

  return (
    <>
      <AdminNav />
      <main>
        <h1>Visits per domain</h1>
        <p className="muted">
          Lander visits help you price: a name that attracts steady type-in traffic is worth more
          than one nobody looks at.
        </p>
        {rows.length === 0 ? (
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
                {rows.map((r) => (
                  <tr key={r.domain}>
                    <td>{r.domain}</td>
                    <td>{r.total}</td>
                    <td>{r.last30}</td>
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

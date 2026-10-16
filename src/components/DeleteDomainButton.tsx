"use client";

export function DeleteDomainButton({ domain }: { domain: string }) {
  return (
    <form method="POST" action="/api/admin/domains" style={{ display: "inline" }}>
      <input type="hidden" name="action" value="delete" />
      <input type="hidden" name="domain" value={domain} />
      <button
        type="submit"
        style={{
          background: "none",
          border: 0,
          color: "var(--danger)",
          cursor: "pointer",
          fontSize: "0.95rem",
          padding: 0,
        }}
        onClick={(e) => {
          if (!window.confirm(`Delete ${domain} from the inventory?`)) e.preventDefault();
        }}
      >
        Delete
      </button>
    </form>
  );
}

import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#f4f7fb" }}>
      <div style={{ maxWidth: 760, width: "100%", background: "white", border: "1px solid #d6dbe4", borderRadius: 20, padding: 28 }}>
        <h1 style={{ marginTop: 0 }}>FDL Tournament Centre</h1>
        <p>Use separate links for secure scoring and public display.</p>
        <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
          <Link href="/admin" style={{ padding: 14, borderRadius: 12, background: "#03235B", color: "white", fontWeight: "bold", textAlign: "center" }}>Open Admin</Link>
          <Link href="/public" style={{ padding: 14, borderRadius: 12, background: "#e5e7eb", color: "#111827", fontWeight: "bold", textAlign: "center" }}>Open Public View</Link>
        </div>
      </div>
    </main>
  );
}
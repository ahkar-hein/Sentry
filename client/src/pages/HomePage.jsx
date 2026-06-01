import { useAuth } from "../context/AuthContext";
import PanicButton from "../components/emergency/PanicButton";

// TODO: Add post feed, create post form, safety score widget
export default function HomePage() {
  const { user } = useAuth();
  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <h2 style={{ marginBottom: 4 }}>Welcome, {user.name}</h2>
      <p style={{ color: "#64748b", marginBottom: 24 }}>Your community: <strong>{user.homeCity}</strong></p>
      <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 16, marginBottom: 24 }}>
        <PanicButton user={user} />
      </div>
      <p style={{ color: "#9ca3af", fontSize: 14, textAlign: "center" }}>
        Post feed coming in Phase 2 — build it next!
      </p>
    </div>
  );
}

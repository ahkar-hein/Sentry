import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import PanicButton from "../components/emergency/PanicButton";
import PostFeed from "../components/posts/PostFeed";

export default function HomePage() {
  const { user } = useAuth();
  const [showPanic, setShowPanic] = useState(false);

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 16px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20 }}>
            🏘️ {user.homeCity}
          </h2>
          <p style={{ margin: 0, color: "#6b7280", fontSize: 13 }}>Your community feed</p>
        </div>
        <button
          onClick={() => setShowPanic(!showPanic)}
          style={{ padding: "8px 16px", background: "#dc2626", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 13 }}
        >
          🚨 SOS
        </button>
      </div>

      {/* Panic button — shown when SOS clicked */}
      {showPanic && (
        <div style={{ background: "#fef2f2", border: "2px solid #fca5a5", borderRadius: 16, marginBottom: 20 }}>
          <PanicButton user={user} />
        </div>
      )}

      {/* Post feed */}
      <PostFeed user={user} city={user.homeCity} readOnly={false} />
    </div>
  );
}

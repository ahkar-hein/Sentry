import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import PostFeed from "../components/posts/PostFeed";
import api from "../utils/api";

export default function ExplorePage() {
  const { user } = useAuth();
  const [communities, setCommunities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/communities")
      .then((r) => {
        const others = r.data.filter(
          (c) => c.city.toLowerCase() !== user.homeCity.toLowerCase()
        );
        setCommunities(others);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container">
      <h2 style={{ marginBottom: 4, fontSize: 18, fontWeight: 700 }}>🗺️ Explore</h2>
      <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 16 }}>
        Browse other LA County communities — read only.
      </p>

      {!selectedCity ? (
        loading ? (
          <p style={{ color: "#9ca3af", fontSize: 13 }}>Loading communities...</p>
        ) : (
          <div className="community-grid">
            {communities.map((c) => (
              <button
                key={c.city}
                onClick={() => setSelectedCity(c.city)}
                style={{ padding: 14, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, cursor: "pointer", textAlign: "left", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
              >
                <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: 14 }}>{c.city}</p>
                <p style={{ margin: "0 0 8px", fontSize: 12, color: "#9ca3af" }}>
                  {c.memberCount} members
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.safetyScore >= 70 ? "#22c55e" : c.safetyScore >= 40 ? "#f59e0b" : "#ef4444" }} />
                  <span style={{ fontSize: 11, color: "#6b7280" }}>
                    {c.safetyScore}/100
                  </span>
                </div>
              </button>
            ))}
          </div>
        )
      ) : (
        <div>
          <button
            onClick={() => setSelectedCity(null)}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#1d4ed8", fontSize: 14, marginBottom: 16, padding: 0 }}
          >
            ← Back
          </button>
          <h3 style={{ marginBottom: 16 }}>{selectedCity}</h3>
          <PostFeed user={user} city={selectedCity} readOnly={true} />
        </div>
      )}
    </div>
  );
}

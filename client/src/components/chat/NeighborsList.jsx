import { useState, useEffect } from "react";
import api from "../../utils/api";
import { useCall } from "../../context/CallContext";

export default function NeighborsList({ user, onSelectNeighbor }) {
  const [neighbors, setNeighbors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { startCall } = useCall();

  useEffect(() => {
    api.get(`/users/neighbors/${user.homeCity}`)
      .then((r) => setNeighbors(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user.homeCity]);

  const filtered = neighbors.filter((n) =>
    n.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #e5e7eb" }}>
        <p style={{ margin: "0 0 10px", fontWeight: 700, fontSize: 15 }}>
          👥 Neighbors in {user.homeCity}
        </p>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search neighbors..."
          style={{ width: "100%", padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }}
        />
      </div>

      <div style={{ maxHeight: 400, overflowY: "auto" }}>
        {loading ? (
          <p style={{ padding: 16, color: "#9ca3af", fontSize: 13 }}>Loading neighbors...</p>
        ) : filtered.length === 0 ? (
          <p style={{ padding: 16, color: "#9ca3af", fontSize: 13 }}>No neighbors found</p>
        ) : (
          filtered.map((neighbor) => (
            <div
              key={neighbor._id}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: "1px solid #f9fafb" }}
            >
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#1d4ed8", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                {neighbor.name?.[0]?.toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{neighbor.name}</p>
                <p style={{ margin: 0, fontSize: 12, color: "#9ca3af" }}>{neighbor.homeCity}</p>
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: 8 }}>
                {/* Message button */}
                <button
                  onClick={() => onSelectNeighbor(neighbor)}
                  style={{ padding: "6px 12px", background: "#eff6ff", color: "#1d4ed8", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}
                >
                  💬
                </button>
                {/* Call button */}
                <button
                  onClick={() => startCall(neighbor)}
                  style={{ padding: "6px 12px", background: "#f0fdf4", color: "#16a34a", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}
                >
                  📞
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

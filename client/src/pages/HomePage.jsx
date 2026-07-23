import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import PanicButton from "../components/emergency/PanicButton";
import PostFeed from "../components/posts/PostFeed";
import socket from "../utils/socket";

export default function HomePage() {
  const { user } = useAuth();
  const [showPanic, setShowPanic] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState([]);

  useEffect(() => {
    socket.on("new_emergency_alert", (alert) => {
      if (alert.city === user.homeCity) {
        setActiveAlerts((prev) => [...prev, { ...alert, createdAt: new Date() }]);
      }
    });
    return () => socket.off("new_emergency_alert");
  }, [user.homeCity]);

  return (
    <div className="container">
      {/* Emergency alert banners */}
      {activeAlerts.map((alert, index) => (
        <div key={index} style={{ background: "#fef2f2", border: "2px solid #dc2626", borderRadius: 12, padding: 12, marginBottom: 12, fontSize: 13, color: "#dc2626", fontWeight: 600 }}>
          🚨 {alert.type?.toUpperCase()} alert nearby — Stay safe!
          <button onClick={() => setActiveAlerts((prev) => prev.filter((_, i) => i !== index))} style={{ float: "right", background: "none", border: "none", cursor: "pointer", color: "#dc2626", fontSize: 16 }}>✕</button>
        </div>
      ))}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, marginTop: 8 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>🏘️ {user.homeCity}</h2>
          <p style={{ margin: 0, color: "#6b7280", fontSize: 13 }}>Your community feed</p>
        </div>
        <button
          onClick={() => setShowPanic(!showPanic)}
          style={{ padding: "8px 14px", background: "#dc2626", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 13 }}
        >
          SOS
        </button>
      </div>

      {/* Panic button */}
      {showPanic && (
        <div style={{ background: "#fff", border: "2px solid #fca5a5", borderRadius: 16, marginBottom: 20, overflow: "hidden" }}>
          <div style={{ background: "#fef2f2", padding: "10px 16px", borderBottom: "1px solid #fca5a5" }}>
            <p style={{ margin: 0, fontSize: 13, color: "#dc2626", fontWeight: 600 }}>
              🚨 Emergency Alert System
            </p>
          </div>
          <PanicButton user={user} />
        </div>
      )}

      {/* Post feed */}
      <PostFeed user={user} city={user.homeCity} readOnly={false} />
    </div>
  );
}
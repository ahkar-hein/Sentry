import { useState, useRef, useEffect } from "react";
import api from "../../utils/api";
import socket from "../../utils/socket";

const EMERGENCY_TYPES = [
  { id: "crime", label: "Crime", icon: "🔫", color: "#dc2626" },
  { id: "vehicle", label: "Vehicle", icon: "🚗", color: "#ea580c" },
  { id: "fire", label: "Fire", icon: "🔥", color: "#d97706" },
  { id: "medical", label: "Medical", icon: "🏥", color: "#2563eb" },
  { id: "child", label: "Child", icon: "👶", color: "#7c3aed" },
  { id: "suspicious", label: "Suspicious", icon: "⚠️", color: "#ca8a04" },
];

export default function PanicButton({ user }) {
  const [phase, setPhase] = useState("idle"); // idle | holding | selecting | countdown | sent
  const [selectedType, setSelectedType] = useState(null);
  const [countdown, setCountdown] = useState(10);
  const holdTimer = useRef(null);
  const countdownTimer = useRef(null);

  // Hold for 3 seconds to activate
  const handleMouseDown = () => {
    holdTimer.current = setTimeout(() => setPhase("selecting"), 3000);
  };

  const handleMouseUp = () => {
    clearTimeout(holdTimer.current);
    if (phase === "idle") setPhase("idle");
  };

  // Start countdown after type selected (or default after 5s)
  useEffect(() => {
    if (phase === "selecting") {
      const autoSend = setTimeout(() => startCountdown("general"), 5000);
      return () => clearTimeout(autoSend);
    }
  }, [phase]);

  const startCountdown = (type) => {
    setSelectedType(type);
    setPhase("countdown");
    setCountdown(10);
  };

  // Countdown tick
  useEffect(() => {
    if (phase === "countdown") {
      if (countdown === 0) {
        sendAlert();
        return;
      }
      countdownTimer.current = setTimeout(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(countdownTimer.current);
  }, [phase, countdown]);

  const sendAlert = async () => {
    setPhase("sent");
    try {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const location = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          address: "",
        };
        await api.post("/alerts", {
          type: selectedType || "general",
          trigger: "panic_button",
          location,
        });
        socket.emit("emergency_alert", {
          city: user.homeCity,
          type: selectedType,
          location,
        });
      });
    } catch (err) {
      console.error("Alert failed:", err);
    }
    setTimeout(() => setPhase("idle"), 4000);
  };

  const cancel = () => {
    clearTimeout(countdownTimer.current);
    setPhase("idle");
    setCountdown(10);
    setSelectedType(null);
  };

  if (phase === "sent") return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <div style={{ fontSize: 48 }}>🚨</div>
      <p style={{ color: "#dc2626", fontWeight: 700, fontSize: 18 }}>Alert Sent!</p>
      <p style={{ color: "#666", fontSize: 14 }}>Neighbors and police have been notified.</p>
    </div>
  );

  if (phase === "countdown") return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <div style={{ fontSize: 64, fontWeight: 700, color: "#dc2626" }}>{countdown}</div>
      <p style={{ color: "#333", marginBottom: 16 }}>Sending <strong>{selectedType}</strong> alert...</p>
      <button onClick={cancel} style={{ padding: "12px 32px", background: "#374151", color: "#fff", border: "none", borderRadius: 8, fontSize: 16, cursor: "pointer", fontWeight: 600 }}>
        CANCEL
      </button>
    </div>
  );

  if (phase === "selecting") return (
    <div style={{ padding: 16 }}>
      <p style={{ fontWeight: 600, marginBottom: 12, textAlign: "center" }}>What is the emergency?</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {EMERGENCY_TYPES.map((t) => (
          <button key={t.id} onClick={() => startCountdown(t.id)} style={{ padding: "12px 8px", background: t.color, color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 24 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>
      <button onClick={cancel} style={{ width: "100%", marginTop: 12, padding: 10, background: "#f3f4f6", border: "none", borderRadius: 8, cursor: "pointer", color: "#374151" }}>
        Cancel
      </button>
    </div>
  );

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <button
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        style={{ width: 120, height: 120, borderRadius: "50%", background: "#dc2626", color: "#fff", border: "4px solid #991b1b", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(220,38,38,0.5)", userSelect: "none" }}
      >
        HOLD 3 SEC{"\n"}SOS
      </button>
      <p style={{ color: "#9ca3af", fontSize: 12, marginTop: 8 }}>Hold for 3 seconds to activate</p>
    </div>
  );
}

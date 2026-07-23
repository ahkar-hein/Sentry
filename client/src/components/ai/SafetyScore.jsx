import { useState, useEffect } from "react";
import api from "../../utils/api";

const LEVEL_CONFIG = {
  safe:      { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", emoji: "✅", label: "Safe" },
  moderate:  { color: "#d97706", bg: "#fffbeb", border: "#fde68a", emoji: "⚠️", label: "Moderate" },
  high_risk: { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", emoji: "🚨", label: "High Risk" },
};

export default function SafetyScore({ city }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/ai/safety/${city}`)
      .then((r) => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [city]);

  if (loading) return (
    <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
      <p style={{ color: "#9ca3af", fontSize: 13 }}>Analyzing safety...</p>
    </div>
  );

  if (!data) return null;

  const config = LEVEL_CONFIG[data.level] || LEVEL_CONFIG.moderate;

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: 16 }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>🛡️ Safety Score</p>
        <span style={{ fontSize: 12, color: "#9ca3af" }}>{city}</span>
      </div>

      {/* Score circle */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: config.bg, border: `3px solid ${config.color}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: config.color }}>{data.score}</span>
          <span style={{ fontSize: 10, color: config.color }}>/ 100</span>
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <span>{config.emoji}</span>
            <span style={{ fontWeight: 600, color: config.color, fontSize: 15 }}>{config.label}</span>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.4 }}>{data.summary}</p>
        </div>
      </div>

      {/* Score bar */}
      <div style={{ background: "#f3f4f6", borderRadius: 8, height: 8, marginBottom: 12, overflow: "hidden" }}>
        <div style={{ width: `${data.score}%`, height: "100%", background: config.color, borderRadius: 8, transition: "width 1s ease" }} />
      </div>

      {/* Safety tips */}
      {data.tips?.length > 0 && (
        <div>
          <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase" }}>Safety Tips</p>
          {data.tips.map((tip, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 13, color: "#374151" }}>
              <span style={{ color: config.color, flexShrink: 0 }}>•</span>
              {tip}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

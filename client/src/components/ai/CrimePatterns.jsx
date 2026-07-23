import { useState, useEffect } from "react";
import api from "../../utils/api";

export default function CrimePatterns({ city }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // First get recent alerts then analyze patterns
    api.get(`/alerts/${city}`)
      .then(async (r) => {
        const alerts = r.data;
        if (alerts.length === 0) {
          setData({ patterns: [], hotspots: [], summary: "No recent alerts to analyze.", recommendation: "Keep reporting incidents to build a safety picture." });
          return;
        }
        const patternRes = await api.post("/ai/patterns", { city, alerts });
        setData(patternRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [city]);

  if (loading) return (
    <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
      <p style={{ color: "#9ca3af", fontSize: 13 }}>Analyzing crime patterns...</p>
    </div>
  );

  if (!data) return null;

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: 16 }}>
      <p style={{ margin: "0 0 12px", fontWeight: 700, fontSize: 15 }}>🔍 Crime Pattern Analysis</p>

      <p style={{ margin: "0 0 12px", fontSize: 13, color: "#374151", background: "#f9fafb", padding: "8px 12px", borderRadius: 8 }}>
        {data.summary}
      </p>

      {data.patterns?.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase" }}>Patterns Detected</p>
          {data.patterns.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4, fontSize: 13, color: "#374151" }}>
              <span>⚠️</span>{p}
            </div>
          ))}
        </div>
      )}

      {data.hotspots?.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase" }}>Hotspot Areas</p>
          {data.hotspots.map((h, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4, fontSize: 13, color: "#374151" }}>
              <span>📍</span>{h}
            </div>
          ))}
        </div>
      )}

      {data.recommendation && (
        <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#1d4ed8" }}>
          💡 {data.recommendation}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AIChat from "../components/ai/AIChat";
import SafetyScore from "../components/ai/SafetyScore";
import CrimePatterns from "../components/ai/CrimePatterns";

export default function AIPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState("chat"); // chat | safety | patterns

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "24px 16px", height: "calc(100vh - 65px)", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 20 }}>🤖 Sentry AI</h2>
        <p style={{ margin: 0, color: "#6b7280", fontSize: 13 }}>
          AI-powered safety features for {user.homeCity}
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[
          { id: "chat", label: "💬 AI Chat" },
          { id: "safety", label: "🛡️ Safety Score" },
          { id: "patterns", label: "🔍 Crime Patterns" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{ flex: 1, padding: "10px 0", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 13, background: tab === t.id ? "#1d4ed8" : "#f3f4f6", color: tab === t.id ? "#fff" : "#374151" }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {tab === "chat" && <AIChat user={user} />}
        {tab === "safety" && <SafetyScore city={user.homeCity} />}
        {tab === "patterns" && <CrimePatterns city={user.homeCity} />}
      </div>
    </div>
  );
}

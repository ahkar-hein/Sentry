import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AIChat from "../components/ai/AIChat";
import SafetyScore from "../components/ai/SafetyScore";
import CrimePatterns from "../components/ai/CrimePatterns";

export default function AIPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState("chat");

  return (
    <div className="container" style={{ paddingBottom: 0 }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700 }}>🤖 Sentry AI</h2>
        <p style={{ margin: 0, color: "#6b7280", fontSize: 13 }}>
          AI safety features for {user.homeCity}
        </p>
      </div>

      <div className="tabs">
        {[
          { id: "chat", label: "💬 Chat" },
          { id: "safety", label: "🛡️ Safety" },
          { id: "patterns", label: "🔍 Patterns" },
        ].map((t) => (
          <button
            key={t.id}
            className={`tab ${tab === t.id ? "active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "chat" && <AIChat user={user} />}
      {tab === "safety" && <SafetyScore city={user.homeCity} />}
      {tab === "patterns" && <CrimePatterns city={user.homeCity} />}
    </div>
  );
}

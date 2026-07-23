import { useState, useRef, useEffect } from "react";
import api from "../../utils/api";

const QUICK_QUESTIONS = [
  "Is my area safe right now?",
  "What should I do if I see something suspicious?",
  "How do I use the emergency alert?",
  "What happens when I press SOS?",
];

export default function AIChat({ user }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: `Hi! I'm Sentry AI 🤖 I'm here to help you stay safe in ${user.homeCity}. Ask me anything!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const message = text || input;
    if (!message.trim()) return;
    setInput("");

    setMessages((prev) => [...prev, { role: "user", text: message }]);
    setLoading(true);

    try {
      const { data } = await api.post("/ai/chat", {
        message,
        city: user.homeCity,
      });
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: "Sorry, I'm unavailable right now. Please call 911 in emergencies." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>

      {/* Header */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #e5e7eb", background: "#0f172a", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#1d4ed8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
          🤖
        </div>
        <div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#fff" }}>Sentry AI</p>
          <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>Community safety assistant</p>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
            {m.role === "assistant" && (
              <span style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2, marginLeft: 4 }}>Sentry AI</span>
            )}
            <div style={{ maxWidth: "80%", padding: "10px 14px", borderRadius: m.role === "user" ? "12px 12px 4px 12px" : "12px 12px 12px 4px", background: m.role === "user" ? "#1d4ed8" : "#f3f4f6", color: m.role === "user" ? "#fff" : "#111", fontSize: 14, lineHeight: 1.5 }}>
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ alignSelf: "flex-start" }}>
            <div style={{ padding: "10px 14px", background: "#f3f4f6", borderRadius: "12px 12px 12px 4px", fontSize: 14, color: "#9ca3af" }}>
              Thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick questions */}
      <div style={{ padding: "8px 12px", borderTop: "1px solid #f3f4f6", display: "flex", gap: 6, flexWrap: "wrap" }}>
        {QUICK_QUESTIONS.map((q, i) => (
          <button
            key={i}
            onClick={() => sendMessage(q)}
            style={{ padding: "4px 10px", background: "#f3f4f6", border: "none", borderRadius: 20, fontSize: 11, cursor: "pointer", color: "#374151" }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: 12, borderTop: "1px solid #e5e7eb", display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask Sentry AI..."
          style={{ flex: 1, padding: "10px 14px", border: "1px solid #e5e7eb", borderRadius: 24, fontSize: 14, outline: "none" }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          style={{ padding: "10px 18px", background: input.trim() && !loading ? "#1d4ed8" : "#93c5fd", color: "#fff", border: "none", borderRadius: 24, cursor: "pointer", fontWeight: 600, fontSize: 14 }}
        >
          Ask
        </button>
      </div>
    </div>
  );
}

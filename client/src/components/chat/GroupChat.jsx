import { useState, useEffect, useRef } from "react";
import api from "../../utils/api";
import socket from "../../utils/socket";

export default function GroupChat({ user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    // Load chat history
    api.get(`/chat/group/${user.homeCity}`).then((r) => setMessages(r.data));

    // Listen for new messages via Socket.io
    socket.on("new_group_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Emergency alerts also appear in chat
    socket.on("new_emergency_alert", (alert) => {
      setMessages((prev) => [...prev, {
        _id: alert.alertId,
        sender: { name: "SENTRY ALERT" },
        content: `🚨 ${alert.type.toUpperCase()} reported nearby. Stay alert.`,
        type: "alert",
        createdAt: new Date(),
      }]);
    });

    return () => {
      socket.off("new_group_message");
      socket.off("new_emergency_alert");
    };
  }, [user.homeCity]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const content = input;
    setInput("");
    await api.post("/chat/group", { content, city: user.homeCity });
    socket.emit("group_message", {
      city: user.homeCity,
      sender: { name: user.name },
      content,
      createdAt: new Date(),
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #e5e7eb", fontWeight: 600 }}>
        {user.homeCity} Community Chat
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.sender?.name === user.name ? "flex-end" : "flex-start" }}>
            <span style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>{m.sender?.name}</span>
            <div style={{ padding: "8px 12px", borderRadius: 10, maxWidth: "70%", fontSize: 14, background: m.type === "alert" ? "#fef2f2" : m.sender?.name === user.name ? "#1d4ed8" : "#f3f4f6", color: m.type === "alert" ? "#dc2626" : m.sender?.name === user.name ? "#fff" : "#111", fontWeight: m.type === "alert" ? 600 : 400, border: m.type === "alert" ? "1px solid #fca5a5" : "none" }}>
              {m.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div style={{ display: "flex", borderTop: "1px solid #e5e7eb", padding: 8, gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Message your community..."
          style={{ flex: 1, padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, outline: "none" }}
        />
        <button onClick={sendMessage} style={{ padding: "8px 16px", background: "#1d4ed8", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
          Send
        </button>
      </div>
    </div>
  );
}

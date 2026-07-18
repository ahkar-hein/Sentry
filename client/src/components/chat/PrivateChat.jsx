import { useState, useEffect, useRef } from "react";
import api from "../../utils/api";
import socket from "../../utils/socket";

export default function PrivateChat({ user, recipient, onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    // Load private chat history
    api.get(`/chat/private/${recipient._id}`)
      .then((r) => setMessages(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));

    // Listen for incoming private messages
    socket.on("new_private_message", (msg) => {
      const isRelevant =
        (msg.sender?._id === recipient._id) ||
        (msg.sender?._id === user.id);
      if (isRelevant) {
        setMessages((prev) => {
          if (prev.find((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      }
    });

    return () => socket.off("new_private_message");
  }, [recipient._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const content = input.trim();
    setInput("");

    try {
      const { data } = await api.post("/chat/private", {
        content,
        recipientId: recipient._id,
      });

      // Emit to socket for real-time delivery
      socket.emit("private_message", {
        ...data,
        recipientId: recipient._id,
        senderId: user.id,
      });

      setMessages((prev) => [...prev, data]);
    } catch (err) {
      console.error("Send private message failed:", err);
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  const isMyMessage = (msg) => msg.sender?._id === user.id || msg.sender?.name === user.name;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>

      {/* Header */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={onBack}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#1d4ed8", fontSize: 20, padding: 0, lineHeight: 1 }}
        >
          ←
        </button>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#1d4ed8", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 15 }}>
          {recipient.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>{recipient.name}</p>
          <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>Private message</p>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        {loading ? (
          <p style={{ color: "#9ca3af", fontSize: 13, textAlign: "center" }}>Loading messages...</p>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>
            <p style={{ fontSize: 32, margin: "0 0 8px" }}>👋</p>
            <p style={{ fontSize: 14 }}>Start a conversation with {recipient.name}</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const mine = isMyMessage(msg);
            return (
              <div key={msg._id || i} style={{ display: "flex", flexDirection: "column", alignItems: mine ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "70%", padding: "8px 12px", borderRadius: mine ? "12px 12px 4px 12px" : "12px 12px 12px 4px", background: mine ? "#1d4ed8" : "#f3f4f6", color: mine ? "#fff" : "#111", fontSize: 14 }}>
                  {msg.content}
                </div>
                <span style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>
                  {timeAgo(msg.createdAt)}
                </span>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: 12, borderTop: "1px solid #e5e7eb", display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder={`Message ${recipient.name}...`}
          style={{ flex: 1, padding: "10px 14px", border: "1px solid #e5e7eb", borderRadius: 24, fontSize: 14, outline: "none" }}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          style={{ padding: "10px 18px", background: input.trim() ? "#1d4ed8" : "#93c5fd", color: "#fff", border: "none", borderRadius: 24, cursor: input.trim() ? "pointer" : "not-allowed", fontWeight: 600, fontSize: 14 }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

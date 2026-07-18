import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import GroupChat from "../components/chat/GroupChat";
import PrivateChat from "../components/chat/PrivateChat";
import NeighborsList from "../components/chat/NeighborsList";

export default function ChatPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState("group"); // group | neighbors | private
  const [selectedNeighbor, setSelectedNeighbor] = useState(null);

  const handleSelectNeighbor = (neighbor) => {
    setSelectedNeighbor(neighbor);
    setTab("private");
  };

  const handleBackFromPrivate = () => {
    setSelectedNeighbor(null);
    setTab("neighbors");
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "24px 16px", height: "calc(100vh - 65px)", display: "flex", flexDirection: "column" }}>

      {/* Tabs */}
      {tab !== "private" && (
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <button
            onClick={() => setTab("group")}
            style={{ flex: 1, padding: "10px 0", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 14, background: tab === "group" ? "#1d4ed8" : "#f3f4f6", color: tab === "group" ? "#fff" : "#374151" }}
          >
            💬 Community Chat
          </button>
          <button
            onClick={() => setTab("neighbors")}
            style={{ flex: 1, padding: "10px 0", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 14, background: tab === "neighbors" ? "#1d4ed8" : "#f3f4f6", color: tab === "neighbors" ? "#fff" : "#374151" }}
          >
            👥 Neighbors
          </button>
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        {tab === "group" && <GroupChat user={user} />}
        {tab === "neighbors" && (
          <NeighborsList user={user} onSelectNeighbor={handleSelectNeighbor} />
        )}
        {tab === "private" && selectedNeighbor && (
          <PrivateChat
            user={user}
            recipient={selectedNeighbor}
            onBack={handleBackFromPrivate}
          />
        )}
      </div>
    </div>
  );
}

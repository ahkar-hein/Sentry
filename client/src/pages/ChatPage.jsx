import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import GroupChat from "../components/chat/GroupChat";
import PrivateChat from "../components/chat/PrivateChat";
import NeighborsList from "../components/chat/NeighborsList";

export default function ChatPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState("group");
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
    <div className="container" style={{ paddingBottom: 0 }}>
      {tab !== "private" && (
        <div className="tabs">
          <button className={`tab ${tab === "group" ? "active" : ""}`} onClick={() => setTab("group")}>
            💬 Community
          </button>
          <button className={`tab ${tab === "neighbors" ? "active" : ""}`} onClick={() => setTab("neighbors")}>
            👥 Neighbors
          </button>
        </div>
      )}

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
  );
}

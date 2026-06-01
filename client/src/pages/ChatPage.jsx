import { useAuth } from "../context/AuthContext";
import GroupChat from "../components/chat/GroupChat";

// TODO: Add private chat sidebar and voice call component
export default function ChatPage() {
  const { user } = useAuth();
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24, height: "calc(100vh - 60px)" }}>
      <GroupChat user={user} />
    </div>
  );
}

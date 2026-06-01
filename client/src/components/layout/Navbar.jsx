import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={{ background: "#0f172a", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 20 }}>🛡️</span>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>Sentry</span>
      </div>

      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Link to="/home" style={{ color: "#94a3b8", textDecoration: "none", fontSize: 14 }}>Home</Link>
          <Link to="/explore" style={{ color: "#94a3b8", textDecoration: "none", fontSize: 14 }}>Explore</Link>
          <Link to="/chat" style={{ color: "#94a3b8", textDecoration: "none", fontSize: 14 }}>Chat</Link>
          <span style={{ color: "#64748b", fontSize: 13 }}>{user.homeCity}</span>
          <button onClick={handleLogout} style={{ padding: "6px 14px", background: "transparent", border: "1px solid #475569", color: "#94a3b8", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

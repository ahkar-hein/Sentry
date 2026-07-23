import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    color: isActive(path) ? "#fff" : "#94a3b8",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: isActive(path) ? 600 : 400,
    padding: "4px 8px",
    borderRadius: 6,
    background: isActive(path) ? "rgba(255,255,255,0.1)" : "transparent",
  });

  return (
    <nav style={{ background: "#0f172a", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 20 }}>🛡️</span>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>Sentry</span>
      </div>

      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link to="/home" style={linkStyle("/home")}>Home</Link>
          <Link to="/explore" style={linkStyle("/explore")}>Explore</Link>
          <Link to="/chat" style={linkStyle("/chat")}>Chat</Link>
          <Link to="/ai" style={linkStyle("/ai")}>🤖 AI</Link>
          <span style={{ color: "#475569", fontSize: 13, marginLeft: 8 }}>{user.homeCity}</span>
          <button
            onClick={handleLogout}
            style={{ padding: "6px 14px", background: "transparent", border: "1px solid #475569", color: "#94a3b8", borderRadius: 6, cursor: "pointer", fontSize: 13, marginLeft: 4 }}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

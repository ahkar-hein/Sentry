import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const links = [
    { to: "/home", label: "Home" },
    { to: "/explore", label: "Explore" },
    { to: "/chat", label: "Chat" },
    { to: "/ai", label: "🤖 AI" },
    { to: "/profile", label: `👤 ${user.name}` },
  ];

  return (
    <>
      <nav className="navbar">
        {/* Brand */}
        <Link to="/home" className="navbar-brand">
          <span>🛡️</span>
          <span>Sentry</span>
        </Link>

        {/* Desktop links */}
        {user && (
          <div className="navbar-links">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`navbar-link ${isActive(link.to) ? "active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
            <span style={{ color: "#475569", fontSize: 13, margin: "0 4px" }}>
              {user.homeCity}
            </span>
            <button
              onClick={handleLogout}
              style={{ padding: "6px 14px", background: "transparent", border: "1px solid #475569", color: "#94a3b8", borderRadius: 6, cursor: "pointer", fontSize: 13 }}
            >
              Logout
            </button>
          </div>
        )}

        {/* Mobile hamburger */}
        {user && (
          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span style={{ transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
            <span style={{ transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
          </button>
        )}
      </nav>

      {/* Mobile dropdown menu */}
      {user && (
        <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`navbar-link ${isActive(link.to) ? "active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ padding: "8px 16px", color: "#64748b", fontSize: 13 }}>
            📍 {user.homeCity}
          </div>
          <button
            onClick={handleLogout}
            style={{ margin: "4px 16px", padding: "10px 16px", background: "#dc2626", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600 }}
          >
            Logout
          </button>
        </div>
      )}
    </>
  );
}

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/home");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#1e293b", padding: "32px 24px", borderRadius: 16, width: "100%", maxWidth: 380 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <span style={{ fontSize: 44 }}>🛡️</span>
          <h1 style={{ color: "#fff", margin: "8px 0 4px", fontSize: 24 }}>Sentry</h1>
          <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>When seconds matter, Sentry responds</p>
        </div>

        {error && <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 12 }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            type="email" placeholder="Email" required
            style={{ padding: "11px 14px", borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#fff", fontSize: 14, outline: "none", width: "100%" }}
          />
          <input
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            type="password" placeholder="Password" required
            style={{ padding: "11px 14px", borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#fff", fontSize: 14, outline: "none", width: "100%" }}
          />
          <button
            type="submit" disabled={loading}
            style={{ padding: 12, background: "#dc2626", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer", marginTop: 4 }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p style={{ color: "#64748b", fontSize: 13, textAlign: "center", marginTop: 16 }}>
          No account? <Link to="/register" style={{ color: "#3b82f6" }}>Register</Link>
        </p>
      </div>
    </div>
  );
}

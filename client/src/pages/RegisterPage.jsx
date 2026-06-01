import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", city: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form.name, form.email, form.password, form.city);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#1e293b", padding: 40, borderRadius: 16, width: 360 }}>
        <h2 style={{ color: "#fff", marginBottom: 24, textAlign: "center" }}>Join Sentry</h2>
        {error && <p style={{ color: "#ef4444", fontSize: 14, marginBottom: 12 }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" required style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#fff", fontSize: 14 }} />
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" placeholder="Email" required style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#fff", fontSize: 14 }} />
          <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="password" placeholder="Password" required style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#fff", fontSize: 14 }} />
          <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Your city (e.g. Pomona)" required style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#fff", fontSize: 14 }} />
          <p style={{ color: "#64748b", fontSize: 12, margin: 0 }}>Currently supporting LA County cities only</p>
          <button type="submit" style={{ padding: 12, background: "#dc2626", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            Create Account
          </button>
        </form>
        <p style={{ color: "#64748b", fontSize: 13, textAlign: "center", marginTop: 16 }}>
          Have an account? <Link to="/login" style={{ color: "#3b82f6" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

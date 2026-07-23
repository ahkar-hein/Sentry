import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", city: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.city);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#1e293b", padding: "32px 24px", borderRadius: 16, width: "100%", maxWidth: 380 }}>
        <h2 style={{ color: "#fff", marginBottom: 24, textAlign: "center", fontSize: 22 }}>Join Sentry 🛡️</h2>

        {error && <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 12 }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { key: "name", placeholder: "Full name", type: "text" },
            { key: "email", placeholder: "Email", type: "email" },
            { key: "password", placeholder: "Password", type: "password" },
            { key: "city", placeholder: "Your city (e.g. Pomona)", type: "text" },
          ].map((field) => (
            <input
              key={field.key}
              value={form[field.key]}
              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
              type={field.type}
              placeholder={field.placeholder}
              required
              style={{ padding: "11px 14px", borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#fff", fontSize: 14, outline: "none", width: "100%" }}
            />
          ))}
          <p style={{ color: "#64748b", fontSize: 12, margin: 0 }}>
            Currently supporting LA County cities only
          </p>
          <button
            type="submit" disabled={loading}
            style={{ padding: 12, background: "#dc2626", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer", marginTop: 4 }}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <p style={{ color: "#64748b", fontSize: 13, textAlign: "center", marginTop: 16 }}>
          Have an account? <Link to="/login" style={{ color: "#3b82f6" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", homeCity: "" });
  const [tab, setTab] = useState("posts");

  useEffect(() => {
    api.get("/users/profile")
      .then((r) => {
        setProfile(r.data);
        setForm({ name: r.data.user.name, homeCity: r.data.user.homeCity });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    try {
      const { data } = await api.put("/users/profile", form);
      setProfile({ ...profile, user: data });
      setEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (loading) return (
    <div className="container">
      <p style={{ color: "#9ca3af", textAlign: "center", padding: 40 }}>Loading profile...</p>
    </div>
  );

  if (!profile) return null;

  const { user: profileUser, posts, alerts, stats } = profile;

  return (
    <div className="container">
      {/* Profile header card */}
      <div className="card" style={{ textAlign: "center", padding: 24 }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#1d4ed8", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 32, margin: "0 auto 16px" }}>
          {profileUser.name?.[0]?.toUpperCase()}
        </div>

        {editing ? (
          <div style={{ maxWidth: 300, margin: "0 auto" }}>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Name"
              className="input"
              style={{ marginBottom: 8 }}
            />
            <input
              value={form.homeCity}
              onChange={(e) => setForm({ ...form, homeCity: e.target.value })}
              placeholder="City"
              className="input"
              style={{ marginBottom: 12 }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={handleSave} className="btn btn-primary" style={{ flex: 1 }}>Save</button>
              <button onClick={() => setEditing(false)} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <h2 style={{ margin: "0 0 4px", fontSize: 22 }}>{profileUser.name}</h2>
            <p style={{ margin: "0 0 4px", color: "#6b7280", fontSize: 14 }}>{profileUser.email}</p>
            <p style={{ margin: "0 0 16px", color: "#1d4ed8", fontSize: 14, fontWeight: 600 }}>📍 {profileUser.homeCity}</p>
            <button onClick={() => setEditing(true)} className="btn btn-ghost">
              ✏️ Edit Profile
            </button>
          </>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div className="card" style={{ textAlign: "center", marginBottom: 0 }}>
          <p style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "#1d4ed8" }}>{stats.totalPosts}</p>
          <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>Posts</p>
        </div>
        <div className="card" style={{ textAlign: "center", marginBottom: 0 }}>
          <p style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "#dc2626" }}>{stats.totalAlerts}</p>
          <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>Alerts</p>
        </div>
        <div className="card" style={{ textAlign: "center", marginBottom: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: "#374151" }}>
            {new Date(stats.joinDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
          </p>
          <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>Joined</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${tab === "posts" ? "active" : ""}`} onClick={() => setTab("posts")}>
          My Posts ({posts.length})
        </button>
        <button className={`tab ${tab === "alerts" ? "active" : ""}`} onClick={() => setTab("alerts")}>
          My Alerts ({alerts.length})
        </button>
      </div>

      {/* My Posts */}
      {tab === "posts" && (
        <div>
          {posts.length === 0 ? (
            <div className="card" style={{ textAlign: "center", color: "#9ca3af" }}>
              <p style={{ fontSize: 32, margin: "0 0 8px" }}>📝</p>
              <p>You haven't posted anything yet</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="card">
                <p style={{ margin: "0 0 8px", fontSize: 14 }}>{post.content}</p>
                {post.mediaUrl && (
                  post.type === "video"
                    ? <video src={post.mediaUrl} controls style={{ width: "100%", borderRadius: 8, maxHeight: 200 }} />
                    : <img src={post.mediaUrl} alt="" style={{ width: "100%", borderRadius: 8, maxHeight: 200, objectFit: "cover" }} />
                )}
                <p style={{ margin: "8px 0 0", fontSize: 11, color: "#9ca3af" }}>
                  {new Date(post.createdAt).toLocaleDateString()} · ❤️ {post.likes?.length || 0}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* My Alerts */}
      {tab === "alerts" && (
        <div>
          {alerts.length === 0 ? (
            <div className="card" style={{ textAlign: "center", color: "#9ca3af" }}>
              <p style={{ fontSize: 32, margin: "0 0 8px" }}>✅</p>
              <p>You haven't sent any alerts</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div key={alert._id} className="card" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 24 }}>🚨</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 14, textTransform: "capitalize" }}>{alert.type} alert</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#9ca3af" }}>
                    {new Date(alert.createdAt).toLocaleDateString()} · {alert.status}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
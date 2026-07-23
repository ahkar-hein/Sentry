import { useState, useRef } from "react";
import api from "../../utils/api";

const POST_TYPES = [
  { id: "status", label: "Status", icon: "✏️" },
  { id: "photo", label: "Photo", icon: "📷" },
  { id: "video", label: "Video", icon: "🎥" },
  { id: "location", label: "Location", icon: "📍" },
];

export default function CreatePost({ user, onPostCreated }) {
  const [type, setType] = useState("status");
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [address, setAddress] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!content.trim() && !file) return;
    setLoading(true);
    setError("");
    try {
      let mediaUrlFinal = "";
      let postType = type;

      if (file && (type === "photo" || type === "video")) {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        const { data: uploadData } = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        mediaUrlFinal = uploadData.url;
        postType = uploadData.type;
        setUploading(false);
      }

      const { data } = await api.post("/posts", {
        content,
        type: postType,
        city: user.homeCity,
        mediaUrl: mediaUrlFinal,
        location: address ? { address } : {},
      });

      onPostCreated(data);
      setContent("");
      setFile(null);
      setPreview(null);
      setAddress("");
      setType("status");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
      setUploading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      {/* Type selector */}
      <div className="post-type-selector">
        {POST_TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => { setType(t.id); removeFile(); }}
            className={`post-type-btn ${type === t.id ? "active" : ""}`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={`What's happening in ${user.homeCity}?`}
        rows={3}
        className="input"
        style={{ marginBottom: 8 }}
      />

      {/* Photo upload */}
      {type === "photo" && (
        <div style={{ marginBottom: 8 }}>
          {!preview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{ border: "2px dashed #e5e7eb", borderRadius: 8, padding: 20, textAlign: "center", cursor: "pointer", color: "#9ca3af", fontSize: 13 }}
            >
              <div style={{ fontSize: 28, marginBottom: 6 }}>📷</div>
              Tap to upload a photo
            </div>
          ) : (
            <div style={{ position: "relative" }}>
              <img src={preview} alt="preview" style={{ width: "100%", borderRadius: 8, maxHeight: 280, objectFit: "cover" }} />
              <button onClick={removeFile} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer" }}>✕</button>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
        </div>
      )}

      {/* Video upload */}
      {type === "video" && (
        <div style={{ marginBottom: 8 }}>
          {!preview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{ border: "2px dashed #e5e7eb", borderRadius: 8, padding: 20, textAlign: "center", cursor: "pointer", color: "#9ca3af", fontSize: 13 }}
            >
              <div style={{ fontSize: 28, marginBottom: 6 }}>🎥</div>
              Tap to upload a video
            </div>
          ) : (
            <div style={{ position: "relative" }}>
              <video src={preview} controls style={{ width: "100%", borderRadius: 8, maxHeight: 280 }} />
              <button onClick={removeFile} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer" }}>✕</button>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileChange} style={{ display: "none" }} />
        </div>
      )}

      {/* Location */}
      {type === "location" && (
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter address or location..."
          className="input"
          style={{ marginBottom: 8 }}
        />
      )}

      {error && <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 8 }}>{error}</p>}

      {uploading && (
        <div style={{ padding: "8px 12px", background: "#eff6ff", borderRadius: 8, fontSize: 13, color: "#1d4ed8", marginBottom: 8 }}>
          ⬆️ Uploading...
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "#9ca3af" }}>
          Posting to <strong>{user.homeCity}</strong>
        </span>
        <button
          onClick={handleSubmit}
          disabled={loading || (!content.trim() && !file)}
          className="btn btn-primary"
          style={{ padding: "8px 20px" }}
        >
          {uploading ? "Uploading..." : loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}

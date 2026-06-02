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
  const [address, setAddress] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // When user picks a file show a preview
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected)); // create local preview URL
  };

  // Remove selected file
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
      let mediaUrl = "";
      let postType = type;

      // If file selected upload it to Cloudinary first
      if (file && (type === "photo" || type === "video")) {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        const { data: uploadData } = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        mediaUrl = uploadData.url;
        postType = uploadData.type; // "photo" or "video" from server
        setUploading(false);
      }

      // Create the post
      const payload = {
        content,
        type: postType,
        city: user.homeCity,
        mediaUrl,
        location: address ? { address } : {},
      };

      const { data } = await api.post("/posts", payload);
      onPostCreated(data);

      // Reset form
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
    <div style={{ background: "#fff", borderRadius: 12, padding: 16, marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>

      {/* Post type selector */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        {POST_TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => { setType(t.id); removeFile(); }}
            style={{ padding: "6px 12px", borderRadius: 20, border: "1px solid", borderColor: type === t.id ? "#1d4ed8" : "#e5e7eb", background: type === t.id ? "#eff6ff" : "#fff", color: type === t.id ? "#1d4ed8" : "#6b7280", fontSize: 13, cursor: "pointer" }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Text content */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={`What's happening in ${user.homeCity}?`}
        rows={3}
        style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, resize: "none", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
      />

      {/* Photo upload */}
      {type === "photo" && (
        <div style={{ marginTop: 8 }}>
          {!preview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{ border: "2px dashed #e5e7eb", borderRadius: 8, padding: 24, textAlign: "center", cursor: "pointer", color: "#9ca3af", fontSize: 14 }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
              Click to upload a photo
              <div style={{ fontSize: 12, marginTop: 4 }}>JPG, PNG, GIF, WEBP up to 50MB</div>
            </div>
          ) : (
            <div style={{ position: "relative" }}>
              <img src={preview} alt="preview" style={{ width: "100%", borderRadius: 8, maxHeight: 300, objectFit: "cover" }} />
              <button
                onClick={removeFile}
                style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", fontSize: 14 }}
              >
                ✕
              </button>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
        </div>
      )}

      {/* Video upload */}
      {type === "video" && (
        <div style={{ marginTop: 8 }}>
          {!preview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{ border: "2px dashed #e5e7eb", borderRadius: 8, padding: 24, textAlign: "center", cursor: "pointer", color: "#9ca3af", fontSize: 14 }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>🎥</div>
              Click to upload a video
              <div style={{ fontSize: 12, marginTop: 4 }}>MP4, MOV, AVI up to 50MB</div>
            </div>
          ) : (
            <div style={{ position: "relative" }}>
              <video src={preview} controls style={{ width: "100%", borderRadius: 8, maxHeight: 300 }} />
              <button
                onClick={removeFile}
                style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", fontSize: 14 }}
              >
                ✕
              </button>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileChange} style={{ display: "none" }} />
        </div>
      )}

      {/* Location input */}
      {type === "location" && (
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter address or location name..."
          style={{ width: "100%", padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, marginTop: 8, outline: "none", boxSizing: "border-box" }}
        />
      )}

      {error && <p style={{ color: "#ef4444", fontSize: 13, marginTop: 8 }}>{error}</p>}

      {/* Upload progress */}
      {uploading && (
        <div style={{ marginTop: 8, padding: "8px 12px", background: "#eff6ff", borderRadius: 8, fontSize: 13, color: "#1d4ed8" }}>
          ⬆️ Uploading to Cloudinary...
        </div>
      )}

      {/* Submit */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
        <span style={{ fontSize: 12, color: "#9ca3af" }}>
          Posting to <strong>{user.homeCity}</strong>
        </span>
        <button
          onClick={handleSubmit}
          disabled={loading || (!content.trim() && !file)}
          style={{ padding: "8px 20px", background: loading || (!content.trim() && !file) ? "#93c5fd" : "#1d4ed8", color: "#fff", border: "none", borderRadius: 8, cursor: loading ? "not-allowed" : "pointer", fontWeight: 600, fontSize: 14 }}
        >
          {uploading ? "Uploading..." : loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}

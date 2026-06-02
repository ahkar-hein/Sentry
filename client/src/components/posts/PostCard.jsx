import { useState } from "react";
import api from "../../utils/api";

const TAG_COLORS = {
  crime: "#fee2e2",
  vehicle: "#fef3c7",
  fire: "#ffedd5",
  medical: "#dbeafe",
  event: "#d1fae5",
  help: "#ede9fe",
  food: "#fce7f3",
  news: "#e0f2fe",
  general: "#f3f4f6",
};

export default function PostCard({ post, currentUser }) {
  const [likes, setLikes] = useState(post.likes?.length || 0);
  const [liked, setLiked] = useState(post.likes?.includes(currentUser?.id));
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);
  const [loadingComments, setLoadingComments] = useState(false);

  const handleLike = async () => {
    try {
      const { data } = await api.put(`/posts/${post._id}/like`);
      setLikes(data.likes);
      setLiked(data.liked);
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  const loadComments = async () => {
    if (showComments) {
      setShowComments(false);
      return;
    }
    setLoadingComments(true);
    try {
      const { data } = await api.get(`/posts/${post._id}/comments`);
      setComments(data);
      setShowComments(true);
    } catch (err) {
      console.error("Load comments failed", err);
    } finally {
      setLoadingComments(false);
    }
  };

  const submitComment = async () => {
    if (!commentInput.trim()) return;
    try {
      const { data } = await api.post(`/posts/${post._id}/comments`, {
        content: commentInput,
      });
      setComments((prev) => [...prev, data]);
      setCommentCount((c) => c + 1);
      setCommentInput("");
    } catch (err) {
      console.error("Comment failed", err);
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: 16, marginBottom: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>

      {/* AI Emergency flag */}
      {post.flaggedByAI && (
        <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: "6px 12px", marginBottom: 10, fontSize: 13, color: "#dc2626", fontWeight: 600 }}>
          🚨 AI flagged this post as a potential emergency
        </div>
      )}

      {/* Author + time */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#1d4ed8", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 16 }}>
          {post.author?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{post.author?.name}</p>
          <p style={{ margin: 0, fontSize: 12, color: "#9ca3af" }}>
            {timeAgo(post.createdAt)} · {post.city}
            {post.type !== "status" && ` · ${post.type}`}
          </p>
        </div>
      </div>

      {/* Content */}
      {post.content && (
        <p style={{ margin: "0 0 12px", fontSize: 15, lineHeight: 1.5, color: "#111" }}>
          {post.content}
        </p>
      )}

      {/* Photo */}
      {post.type === "photo" && post.mediaUrl && (
        <img
          src={post.mediaUrl}
          alt="post"
          style={{ width: "100%", borderRadius: 8, marginBottom: 12, maxHeight: 400, objectFit: "cover" }}
          onError={(e) => e.target.style.display = "none"}
        />
      )}

      {/* Video */}
      {post.type === "video" && post.mediaUrl && (
        <video
          src={post.mediaUrl}
          controls
          style={{ width: "100%", borderRadius: 8, marginBottom: 12, maxHeight: 400 }}
        />
      )}

      {/* Location */}
      {post.type === "location" && post.location?.address && (
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "8px 12px", marginBottom: 12, fontSize: 13, color: "#166534" }}>
          📍 {post.location.address}
        </div>
      )}

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
          {post.tags.map((tag) => (
            <span key={tag} style={{ padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: TAG_COLORS[tag] || "#f3f4f6", color: "#374151", textTransform: "uppercase" }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Like + Comment buttons */}
      <div style={{ display: "flex", gap: 16, paddingTop: 10, borderTop: "1px solid #f3f4f6" }}>
        <button
          onClick={handleLike}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: liked ? "#1d4ed8" : "#6b7280", fontWeight: liked ? 600 : 400, fontSize: 14, padding: 0 }}
        >
          {liked ? "👍" : "👍"} {likes} {likes === 1 ? "Like" : "Likes"}
        </button>
        <button
          onClick={loadComments}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: showComments ? "#1d4ed8" : "#6b7280", fontSize: 14, padding: 0 }}
        >
          💬 {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div style={{ marginTop: 12 }}>
          {loadingComments ? (
            <p style={{ color: "#9ca3af", fontSize: 13 }}>Loading comments...</p>
          ) : (
            <>
              {comments.map((c) => (
                <div key={c._id} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                    {c.author?.name?.[0]?.toUpperCase()}
                  </div>
                  <div style={{ background: "#f9fafb", borderRadius: 8, padding: "6px 10px", fontSize: 13 }}>
                    <span style={{ fontWeight: 600 }}>{c.author?.name} </span>
                    {c.content}
                  </div>
                </div>
              ))}

              {/* Add comment input */}
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <input
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitComment()}
                  placeholder="Write a comment..."
                  style={{ flex: 1, padding: "6px 12px", border: "1px solid #e5e7eb", borderRadius: 20, fontSize: 13, outline: "none" }}
                />
                <button
                  onClick={submitComment}
                  style={{ padding: "6px 14px", background: "#1d4ed8", color: "#fff", border: "none", borderRadius: 20, cursor: "pointer", fontSize: 13, fontWeight: 600 }}
                >
                  Post
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

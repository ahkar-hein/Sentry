import { useState, useEffect } from "react";
import api from "../../utils/api";
import PostCard from "./PostCard";
import CreatePost from "./CreatePost";
import socket from "../../utils/socket";

export default function PostFeed({ user, city, readOnly = false }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();

    // Listen for new posts via socket in real time
    socket.on("new_post", (post) => {
      if (post.city === city) {
        setPosts((prev) => [post, ...prev]);
      }
    });

    return () => socket.off("new_post");
  }, [city]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/posts/${city}`);
      setPosts(data);
    } catch (err) {
      console.error("Failed to load posts", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
    // Broadcast to others in same city
    socket.emit("new_post", newPost);
  };

  return (
    <div>
      {/* Create post — only in home city */}
      {!readOnly && (
        <CreatePost user={user} onPostCreated={handlePostCreated} />
      )}

      {readOnly && (
        <div style={{ background: "#fef9c3", border: "1px solid #fde047", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#854d0e" }}>
          👀 You are viewing <strong>{city}</strong> in read-only mode. Switch to your home city to post.
        </div>
      )}

      {/* Posts */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>
          Loading posts...
        </div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>
          <p style={{ fontSize: 32 }}>🏘️</p>
          <p>No posts yet in {city}. Be the first to post!</p>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard key={post._id} post={post} currentUser={user} />
        ))
      )}
    </div>
  );
}

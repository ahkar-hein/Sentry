const axios = require("axios");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

// GET /api/posts/:city — get posts for a city (anyone can read)
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ city: req.params.city })
      .populate("author", "name avatar")
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/posts — create post (home city only)
const createPost = async (req, res) => {
  const { content, type, mediaUrl, location } = req.body;
  const city = req.user.homeCity;
  try {
    // Ask AI to tag and classify the post
    let tags = [];
    let flaggedByAI = false;
    try {
      const aiRes = await axios.post(
        `${process.env.AI_SERVICE_URL}/classify`,
        { content }
      );
      tags = aiRes.data.tags || [];
      flaggedByAI = aiRes.data.is_emergency || false;
    } catch {
      console.warn("AI classify unavailable");
    }

    const post = await Post.create({
      author: req.user.id,
      city,
      content,
      type: type || "status",
      mediaUrl: mediaUrl || "",
      location: location || {},
      tags,
      flaggedByAI,
    });

    await post.populate("author", "name avatar");
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/posts/:id/like — toggle like
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyLiked = post.likes.includes(req.user.id);
    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }
    await post.save();
    res.json({ likes: post.likes.length, liked: !alreadyLiked });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/posts/:id/comments — get comments for a post
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .populate("author", "name avatar")
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/posts/:id/comments — add comment
const addComment = async (req, res) => {
  try {
    const comment = await Comment.create({
      post: req.params.id,
      author: req.user.id,
      content: req.body.content,
    });

    // Increment comment count on the post
    await Post.findByIdAndUpdate(req.params.id, { $inc: { commentCount: 1 } });

    await comment.populate("author", "name avatar");
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getPosts, createPost, likePost, getComments, addComment };

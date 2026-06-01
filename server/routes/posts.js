const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { requireHomeCommunity } = require("../middleware/communityAccess");
const Post = require("../models/Post");
const axios = require("axios");

// GET posts for any city (home = full, away = read only)
router.get("/:city", async (req, res) => {
  try {
    const posts = await Post.find({ city: req.params.city })
      .populate("author", "name avatar")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST — only allowed in home city
router.post("/", protect, requireHomeCommunity, async (req, res) => {
  const { content, type, mediaUrl, location } = req.body;
  const city = req.user.homeCity;
  try {
    // Ask AI to tag the post and check if it looks like an emergency
    let tags = [];
    let flaggedByAI = false;
    try {
      const aiRes = await axios.post(`${process.env.AI_SERVICE_URL}/classify`, { content });
      tags = aiRes.data.tags;
      flaggedByAI = aiRes.data.is_emergency;
    } catch {
      console.warn("AI classify unavailable");
    }

    const post = await Post.create({ author: req.user.id, city, content, type, mediaUrl, location, tags, flaggedByAI });
    await post.populate("author", "name avatar");
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

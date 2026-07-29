const express = require("express");
const User = require("../models/User");
const Post = require("../models/Post");
const Alert = require("../models/Alert");
const { protect } = require("../middleware/auth");
const router = express.Router();

// GET /api/users/neighbors/:city — get all users in a city
router.get("/neighbors/:city", protect, async (req, res) => {
  try {
    const users = await User.find({
      homeCity: new RegExp(`^${req.params.city}$`, "i"),
      _id: { $ne: req.user.id },
    }).select("name avatar homeCity isOnline");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/profile — get my profile with posts and alerts
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const posts = await Post.find({ author: req.user.id }).sort({ createdAt: -1 });
    const alerts = await Alert.find({ reporter: req.user.id }).sort({ createdAt: -1 });

    res.json({
      user,
      posts,
      alerts,
      stats: {
        totalPosts: posts.length,
        totalAlerts: alerts.length,
        joinDate: user.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/users/profile — update my info
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, homeCity } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, homeCity },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

const express = require("express");
const User = require("../models/User");
const { protect } = require("../middleware/auth");
const router = express.Router();

// GET /api/users/neighbors/:city — get all users in a city except yourself
router.get("/neighbors/:city", protect, async (req, res) => {
  try {
    const users = await User.find({
      homeCity: new RegExp(`^${req.params.city}$`, "i"),
      _id: { $ne: req.user.id }, // exclude yourself
    }).select("name avatar homeCity isOnline");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

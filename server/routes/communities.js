const express = require("express");
const Community = require("../models/Community");
const router = express.Router();

// GET all communities (for explore page)
router.get("/", async (req, res) => {
  try {
    const communities = await Community.find().sort({ city: 1 });
    res.json(communities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single community info
router.get("/:city", async (req, res) => {
  try {
    const community = await Community.findOne({ city: new RegExp(`^${req.params.city}$`, "i") });
    if (!community) return res.status(404).json({ message: "Community not found" });
    res.json(community);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

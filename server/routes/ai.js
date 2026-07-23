const express = require("express");
const axios = require("axios");
const { protect } = require("../middleware/auth");
const router = express.Router();

// POST /api/ai/chat
router.post("/chat", async (req, res) => {
  try {
    const response = await axios.post(`${process.env.AI_SERVICE_URL}/chat`, {
      message: req.body.message,
      city: req.body.city || "your area",
      recent_alerts: req.body.recent_alerts || [],
    });
    res.json(response.data);
  } catch {
    res.status(500).json({ message: "AI service unavailable" });
  }
});

// GET /api/ai/safety/:city
router.get("/safety/:city", async (req, res) => {
  try {
    const response = await axios.get(`${process.env.AI_SERVICE_URL}/safety/${req.params.city}`);
    res.json(response.data);
  } catch {
    res.status(500).json({ message: "AI service unavailable" });
  }
});

// POST /api/ai/patterns
router.post("/patterns", protect, async (req, res) => {
  try {
    const response = await axios.post(`${process.env.AI_SERVICE_URL}/patterns`, {
      city: req.body.city,
      alerts: req.body.alerts || [],
    });
    res.json(response.data);
  } catch {
    res.status(500).json({ message: "AI service unavailable" });
  }
});

module.exports = router;

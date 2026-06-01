const express = require("express");
const { getGroupMessages, getPrivateMessages, saveGroupMessage, savePrivateMessage } = require("../controllers/chatController");
const { protect } = require("../middleware/auth");
const { requireHomeCommunity } = require("../middleware/communityAccess");
const router = express.Router();

router.get("/group/:city", protect, getGroupMessages);
router.post("/group", protect, requireHomeCommunity, saveGroupMessage);
router.get("/private/:userId", protect, getPrivateMessages);
router.post("/private", protect, savePrivateMessage);
module.exports = router;

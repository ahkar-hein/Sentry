const express = require("express");
const {
  getPosts,
  createPost,
  likePost,
  getComments,
  addComment,
} = require("../controllers/postController");
const { protect } = require("../middleware/auth");
const { requireHomeCommunity } = require("../middleware/communityAccess");
const router = express.Router();

router.get("/:city", getPosts);                              // anyone can read
router.post("/", protect, requireHomeCommunity, createPost); // home city only
router.put("/:id/like", protect, likePost);                  // must be logged in
router.get("/:id/comments", getComments);                    // anyone can read
router.post("/:id/comments", protect, addComment);           // must be logged in

module.exports = router;

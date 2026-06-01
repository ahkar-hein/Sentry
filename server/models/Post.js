const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  city: { type: String, required: true }, // which community this post belongs to
  type: {
    type: String,
    enum: ["status", "photo", "video", "live", "location"],
    default: "status"
  },
  content: { type: String, default: "" },
  mediaUrl: { type: String, default: "" },  // Cloudinary URL for photos/videos
  location: {
    lat: Number,
    lng: Number,
    address: String,
  },
  tags: [{ type: String }], // AI auto-generated tags
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  // AI flagged this as potential emergency
  flaggedByAI: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);

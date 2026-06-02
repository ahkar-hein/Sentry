const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  city: { type: String, required: true },
  type: {
    type: String,
    enum: ["status", "photo", "video", "location"],
    default: "status"
  },
  content: { type: String, default: "" },
  mediaUrl: { type: String, default: "" },
  location: {
    lat: Number,
    lng: Number,
    address: String,
  },
  tags: [{ type: String }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  commentCount: { type: Number, default: 0 },
  flaggedByAI: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);

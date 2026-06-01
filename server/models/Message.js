const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  // For group chat: city name. For private chat: null
  city: { type: String, default: null },
  // For private chat: the other user. For group chat: null
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  content: { type: String, required: true },
  type: { type: String, enum: ["text", "alert", "image"], default: "text" },
  read: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);

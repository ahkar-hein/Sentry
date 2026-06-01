const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  city: { type: String, required: true },
  type: {
    type: String,
    enum: ["crime", "vehicle", "fire", "medical", "child", "suspicious", "general"],
    default: "general"
  },
  trigger: {
    type: String,
    enum: ["panic_button", "shake", "emergency_post"],
    required: true
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String, default: "" },
  },
  status: {
    type: String,
    enum: ["active", "resolved", "false_alarm"],
    default: "active"
  },
  // Reporter stays anonymous — only location matters
  notifiedNeighbors: { type: Number, default: 0 },
  policeSMSSent: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Alert", alertSchema);

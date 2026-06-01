const mongoose = require("mongoose");

// Pre-seeded LA County cities
const communitySchema = new mongoose.Schema({
  city: { type: String, required: true, unique: true },
  state: { type: String, default: "CA" },
  county: { type: String, default: "Los Angeles" },
  // Center coordinates for map display
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  // Safety score calculated by AI (0-100)
  safetyScore: { type: Number, default: 50 },
  memberCount: { type: Number, default: 0 },
  // Police dispatch info for this city
  policePhone: { type: String, default: "" },
  policeEmail: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Community", communitySchema);

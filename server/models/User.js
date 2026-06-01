const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "" },
  // Home community — assigned on signup based on GPS, cannot freely change
  homeCity: { type: String, required: true },
  homeZip: { type: String, default: "" },
  // Subscription tier for Phase 2
  subscription: { type: String, enum: ["free", "pro"], default: "free" },
  // Device token for push notifications
  fcmToken: { type: String, default: "" },
  isOnline: { type: Boolean, default: false },
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model("User", userSchema);

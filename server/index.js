const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
require("dotenv").config();

const { initSocket } = require("./socket/socketManager");

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const alertRoutes = require("./routes/alerts");
const chatRoutes = require("./routes/chat");
const communityRoutes = require("./routes/communities");
const aiRoutes = require("./routes/ai");
const uploadRoutes = require("./routes/upload");
const userRoutes = require("./routes/users");

const app = express();
const server = http.createServer(app);
// Init Socket.io
initSocket(server);

app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/users", userRoutes);
app.get("/", (req, res) => res.json({ message: "Sentry API running" }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    server.listen(process.env.PORT || 5000, () => {
      console.log("Sentry server running on port " + (process.env.PORT || 5000));
    });
  })
  .catch((err) => console.error("MongoDB error:", err));

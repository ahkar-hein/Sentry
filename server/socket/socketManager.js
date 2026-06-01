const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // User joins their city's room on connect
    socket.on("join_community", ({ city, userId }) => {
      socket.join(city); // join city room for group chat + alerts
      socket.join(userId); // join private room for DMs
      console.log(`${userId} joined ${city}`);
    });

    // Group chat message
    socket.on("group_message", (data) => {
      // Broadcast to everyone in the city room
      io.to(data.city).emit("new_group_message", data);
    });

    // Private message
    socket.on("private_message", (data) => {
      // Send to recipient's private room
      io.to(data.recipientId).emit("new_private_message", data);
      // Also send back to sender
      io.to(data.senderId).emit("new_private_message", data);
    });

    // Emergency alert — broadcast to whole city instantly
    socket.on("emergency_alert", (data) => {
      io.to(data.city).emit("new_emergency_alert", data);
      console.log("EMERGENCY ALERT fired in:", data.city);
    });

    // WebRTC voice call signaling
    socket.on("call_user", (data) => {
      io.to(data.recipientId).emit("incoming_call", {
        from: data.from,
        signal: data.signal,
        callerName: data.callerName,
      });
    });

    socket.on("answer_call", (data) => {
      io.to(data.to).emit("call_accepted", { signal: data.signal });
    });

    socket.on("end_call", (data) => {
      io.to(data.to).emit("call_ended");
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};

module.exports = { initSocket, getIO };

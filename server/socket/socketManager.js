const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }
  });

  io.on("connection", (socket) => {
    socket.on("join_community", ({ city, userId }) => {
      socket.join(city);
      socket.join(userId);
    });

    // New post — broadcast to city
    socket.on("new_post", (post) => {
      socket.to(post.city).emit("new_post", post);
    });

    socket.on("group_message", (data) => {
      io.to(data.city).emit("new_group_message", data);
    });

    socket.on("private_message", (data) => {
      io.to(data.recipientId).emit("new_private_message", data);
      io.to(data.senderId).emit("new_private_message", data);
    });

    socket.on("emergency_alert", (data) => {
      io.to(data.city).emit("new_emergency_alert", data);
    });

    socket.on("call_user", (data) => {
      io.to(data.recipientId).emit("incoming_call", data);
    });

    socket.on("answer_call", (data) => {
      io.to(data.to).emit("call_accepted", { signal: data.signal });
    });

    socket.on("end_call", (data) => {
      io.to(data.to).emit("call_ended");
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};

module.exports = { initSocket, getIO };

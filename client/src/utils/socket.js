import { io } from "socket.io-client";

// Single shared socket instance
const socket = io(import.meta.env.VITE_SERVER_URL || "http://localhost:5000", { autoConnect: false });

export default socket;

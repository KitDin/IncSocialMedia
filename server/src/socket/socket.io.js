import { Server } from "socket.io";

export const io = (server) =>
  new Server(server, {
    cors: {
      origin: "http://localhost:8080", // Địa chỉ của frontend (Vue.js)
      methods: ["GET", "POST"],
    },
  });

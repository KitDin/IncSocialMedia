import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();

export const io = (server) =>
  new Server(server, {
    cors: {
      origin: `http://localhost:${process.env.PORT_CLIENT}`, // Địa chỉ của frontend (Vue.js)
      methods: ["GET", "POST"],
    },
  });

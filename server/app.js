import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { createServer } from "node:http";
import { Server } from "socket.io";

dotenv.config();

import { router } from "./src/router/user.route.js";
import { socket_server } from "./src/socket/server.socket.js";

const app = express();
const server = createServer(app);

// const io = new Server(server);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080", // Địa chỉ của frontend (Vue.js)
    methods: ["GET", "POST"],
  },
});

// app.use(morgan("combined"));
app.use(cors());
app.use(express.json());
app.use("/api/users/", router);

socket_server(io);

server.listen(process.env.POST, () => {
  console.log(`Server is running on post ${process.env.POST}`);
});

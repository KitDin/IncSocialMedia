import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { createServer } from "node:http";
import { router } from "./src/router/user.route.js";
import { socket_server } from "./src/socket/server.socket.js";
import { routerModerate } from "./src/router/moderate.route.js";
import { io } from "./src/socket/socket.io.js";

dotenv.config();

const app = express();
const server = createServer(app);
// app.use(morgan("combined"));
app.use(cors());
app.use(express.json());

app.use("/api/users/", router);
app.use("/moderate/text", routerModerate);

socket_server(io(server));
server.listen(process.env.POST, () => {
  console.log(`Server is running on post ${process.env.POST}`);
});

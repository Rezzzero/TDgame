import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
  path: "/socket.io",
});

app.use(express.static(path.join(__dirname, "../public")));

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("message", (msg) => {
    console.log("Received message:", msg);
    socket.emit("message", "Hello from server!");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

httpServer.listen(8080, () => {
  console.log("Listening on port 8080");
});

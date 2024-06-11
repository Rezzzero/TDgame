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

const userColors = {};

io.on("connection", (socket) => {
  console.log("A user connected");

  const userCount = io.engine.clientsCount;
  let houseColor, houseColor2;

  if (userCount % 2 === 1) {
    houseColor = "blue";
    houseColor2 = "red";
  } else {
    houseColor = "red";
    houseColor2 = "blue";
  }

  userColors[socket.id] = { houseColor, houseColor2 };

  socket.emit("houseColor", userColors[socket.id].houseColor);
  socket.emit("houseColor2", userColors[socket.id].houseColor2);

  socket.on("disconnect", () => {
    console.log("User disconnected");
    delete userColors[socket.id];
  });
});

httpServer.listen(8080, () => {
  console.log("Listening on port 8080");
});

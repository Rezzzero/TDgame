import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

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

app.use(cors());

app.use(express.static(path.join(__dirname, "../public")));

const rooms = {};

app.get("/rooms", (req, res) => {
  res.json(Object.keys(rooms));
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", (gameId) => {
    socket.join(gameId);

    if (!rooms[gameId]) {
      rooms[gameId] = 0;
    }

    rooms[gameId]++;

    const userCount = rooms[gameId];
    let houseColor, houseColor2;

    if (userCount % 2 === 1) {
      houseColor = "blue";
      houseColor2 = "red";
    } else {
      houseColor = "red";
      houseColor2 = "blue";
    }

    socket.emit("houseColor", houseColor);
    socket.emit("houseColor2", houseColor2);

    console.log(
      `User joined room: ${gameId}, current user count: ${userCount}`
    );

    socket.on("disconnect", () => {
      console.log("User disconnected");

      rooms[gameId]--;

      if (rooms[gameId] === 0) {
        delete rooms[gameId];
      }
    });
  });
});

httpServer.listen(8080, () => {
  console.log("Listening on port 8080");
});

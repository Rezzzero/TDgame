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
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
  path: "/socket.io",
});

app.use(cors());

app.use(express.static(path.join(__dirname, "./index.html")));

const rooms = {};

app.get("/rooms", (req, res) => {
  res.json(Object.keys(rooms));
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", ({ gameId, username }) => {
    socket.join(gameId);

    if (!rooms[gameId]) {
      rooms[gameId] = [];
    }

    const user = { id: socket.id, username, houseColor: "red" };

    if (rooms[gameId].length === 0) {
      user.houseColor = "blue";
    } else if (rooms[gameId].length === 1) {
      user.houseColor = "red";
    }

    rooms[gameId].push(user);

    io.to(gameId).emit("updateUserList", rooms[gameId]);

    socket.emit("houseColor", user.houseColor);

    socket.on("disconnect", () => {
      console.log("User disconnected");

      rooms[gameId] = rooms[gameId].filter((user) => user.id !== socket.id);

      if (rooms[gameId].length === 0) {
        delete rooms[gameId];
      } else {
        io.to(gameId).emit("updateUserList", rooms[gameId]);
      }
    });
  });
});

httpServer.listen(8080, () => {
  console.log("Listening on port 8080");
});

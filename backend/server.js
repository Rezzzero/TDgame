import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { CreateEnemy } from "./gameLogic/CreateEnemy.js";
import { waypoints1, waypoints2 } from "../src/shared/data/map/paths.js";

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

const createGameState = () => ({
  firstEnemies: [CreateEnemy(waypoints1[0].x, waypoints1[0].y, waypoints1, 1)],
  secondEnemies: [CreateEnemy(waypoints2[0].x, waypoints2[0].y, waypoints2, 1)],
  wizards: [],
});

const updateGameState = (gameId) => {
  rooms[gameId].firstEnemies.forEach((enemy) => enemy.update());
  rooms[gameId].secondEnemies.forEach((enemy) => enemy.update());

  io.to(gameId).emit("gameState", {
    firstEnemies: rooms[gameId].firstEnemies.map((enemy) => enemy.getState()),
    secondEnemies: rooms[gameId].secondEnemies.map((enemy) => enemy.getState()),
    wizards: rooms[gameId].wizards,
  });
};

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", ({ gameId, username }) => {
    socket.join(gameId);

    if (!rooms[gameId]) {
      rooms[gameId] = createGameState();
      rooms[gameId].users = [];
    }

    const user = { id: socket.id, username };

    rooms[gameId].users.push(user);

    io.to(gameId).emit("updateUserList", rooms[gameId].users);

    socket.emit("gameState", {
      firstEnemies: rooms[gameId].firstEnemies.map((enemy) => enemy.getState()),
      secondEnemies: rooms[gameId].secondEnemies.map((enemy) =>
        enemy.getState()
      ),
      wizards: rooms[gameId].wizards,
    });

    socket.on("placeWizard", (wizard) => {
      rooms[gameId].wizards.push(wizard);
      io.to(gameId).emit("gameState", {
        firstEnemies: rooms[gameId].firstEnemies.map((enemy) =>
          enemy.getState()
        ),
        secondEnemies: rooms[gameId].secondEnemies.map((enemy) =>
          enemy.getState()
        ),
        wizards: rooms[gameId].wizards,
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");

      rooms[gameId].users = rooms[gameId].users.filter(
        (user) => user.id !== socket.id
      );

      if (rooms[gameId].users.length === 0) {
        delete rooms[gameId];
      } else {
        io.to(gameId).emit("updateUserList", rooms[gameId].users);
      }
    });
  });
});

setInterval(() => {
  Object.keys(rooms).forEach((gameId) => {
    updateGameState(gameId);
  });
}, 1000);

httpServer.listen(8080, () => {
  console.log("Listening on port 8080");
});

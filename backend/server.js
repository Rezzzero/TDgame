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

const createGameState = () => ({
  firstEnemies: [],
  secondEnemies: [],
  firstWizards: [],
  secondWizards: [],
  gameStarted: false,
});

const updateGameState = (gameId) => {
  io.to(gameId).emit("gameState", {
    firstEnemies: rooms[gameId].firstEnemies,
    secondEnemies: rooms[gameId].secondEnemies,
    firstWizards: rooms[gameId].firstWizards,
    secondWizards: rooms[gameId].secondWizards,
  });
};

const gameLoop = () => {
  Object.keys(rooms).forEach((gameId) => {
    updateGameState(gameId);
  });
};

setInterval(gameLoop, 500);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("getPlayerType", (gameId, callback) => {
    if (!rooms[gameId]) {
      rooms[gameId] = createGameState();
      rooms[gameId].users = [];
    }
    let playerType = "firstPlayer";
    if (rooms[gameId].users.length === 1) {
      playerType = "secondPlayer";
    }
    callback(playerType);
  });

  socket.on("joinRoom", ({ gameId, username, playerType }) => {
    socket.join(gameId);

    if (!rooms[gameId]) {
      rooms[gameId] = createGameState();
      rooms[gameId].users = [];
    }

    const user = { id: socket.id, username, playerType };

    rooms[gameId].users.push(user);

    io.to(gameId).emit("updateUserList", rooms[gameId].users);

    socket.emit("gameState", {
      firstEnemies: rooms[gameId].firstEnemies,
      secondEnemies: rooms[gameId].secondEnemies,
      firstWizards: rooms[gameId].firstWizards,
      secondWizards: rooms[gameId].secondWizards,
    });

    if (rooms[gameId].users.length === 2 && !rooms[gameId].gameStarted) {
      rooms[gameId].gameStarted = true;
      io.to(gameId).emit("gameStarted");
    }

    socket.on("placeWizard", ({ wizard, playerType }) => {
      if (playerType === "firstPlayer") {
        rooms[gameId].firstWizards.push(wizard);
      } else if (playerType === "secondPlayer") {
        rooms[gameId].secondWizards.push(wizard);
      }

      updateGameState(gameId);
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

httpServer.listen(8080, () => {
  console.log("Listening on port 8080");
});

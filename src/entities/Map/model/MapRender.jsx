import React, { useRef, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import gameMap from "@shared/assets/map/gameMap.png";
import {
  firstPlayerPlacementTilesData,
  secondPlayerPlacementTilesData,
} from "@shared/data/map/placementTilesData.jsx";
import { GeneratePlacementTiles } from "../utils/GeneratePlacementTiles";
import { AddWizard } from "../utils/AddWizard";
import connectSocket from "../../../socket.io.js";
import { Route } from "../../../shared/constants/constants.js";

const MapRender = () => {
  const canvasRef = useRef(null);
  const socketRef = useRef(null);
  const [users, setUsers] = useState([]);
  const { gameId } = useParams();

  const [gameState, setGameState] = useState({
    firstEnemies: [],
    secondEnemies: [],
    firstWizards: [],
    secondWizards: [],
  });

  useEffect(() => {
    const socket = connectSocket();
    socketRef.current = socket;
    const username = localStorage.getItem("username");

    socket.emit("getPlayerType", gameId, (playerType) => {
      localStorage.setItem("playerType", playerType);

      if (username) {
        socket.emit("joinRoom", { gameId, username, playerType });
      }
    });

    socket.on("updateUserList", (userList) => {
      setUsers(userList);
    });

    socket.on("gameState", (state) => {
      setGameState(state);
    });

    return () => {
      socket.off("updateUserList");
      socket.off("gameState");
      socket.disconnect();
    };
  }, [gameId]);

  const firstPlayerTiles = GeneratePlacementTiles(
    firstPlayerPlacementTilesData
  );
  const secondPlayerTiles = GeneratePlacementTiles(
    secondPlayerPlacementTilesData
  );

  let activeTile = undefined;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const image = new Image();
    image.src = gameMap;
    image.onload = () => {
      animate();
    };

    function animate() {
      requestAnimationFrame(animate);

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      gameState.firstEnemies.forEach((enemy) => {
        ctx.fillStyle = "red";
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      });

      gameState.secondEnemies.forEach((enemy) => {
        ctx.fillStyle = "blue";
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      });

      firstPlayerTiles.forEach((tile) => {
        tile.update(ctx, mouse);
      });

      secondPlayerTiles.forEach((tile) => {
        tile.update(ctx, mouse);
      });

      gameState.firstWizards.forEach((wizard) => {
        AddWizard(wizard.x, wizard.y).draw(ctx);
      });

      gameState.secondWizards.forEach((wizard) => {
        AddWizard(wizard.x, wizard.y).draw(ctx);
      });
    }

    canvas.addEventListener("click", handleCanvasClick);

    function handleCanvasClick(event) {
      if (activeTile && !activeTile.isOccupied) {
        const playerType = localStorage.getItem("playerType");

        const isFirstPlayerTile = firstPlayerTiles.includes(activeTile);
        const isSecondPlayerTile = secondPlayerTiles.includes(activeTile);

        if (
          (playerType === "firstPlayer" && isFirstPlayerTile) ||
          (playerType === "secondPlayer" && isSecondPlayerTile)
        ) {
          const wizard = { x: activeTile.x, y: activeTile.y };
          console.log("playerType", playerType);
          socketRef.current.emit("placeWizard", { wizard, playerType });
          activeTile.isOccupied = true;
        }
      }
    }

    return () => {
      canvas.removeEventListener("click", handleCanvasClick);
    };
  }, [gameState]);

  const mouse = {
    x: undefined,
    y: undefined,
  };

  window.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;

    activeTile = null;
    for (let i = 0; i < firstPlayerTiles.length; i++) {
      const tile = firstPlayerTiles[i];

      if (
        mouse.x > tile.x &&
        mouse.x < tile.x + tile.size &&
        mouse.y > tile.y &&
        mouse.y < tile.y + tile.size
      ) {
        activeTile = tile;
        break;
      }
    }

    for (let i = 0; i < secondPlayerTiles.length; i++) {
      const tile = secondPlayerTiles[i];
      if (
        mouse.x > tile.x &&
        mouse.x < tile.x + tile.size &&
        mouse.y > tile.y &&
        mouse.y < tile.y + tile.size
      ) {
        activeTile = tile;
        break;
      }
    }
  });

  return (
    <>
      <canvas ref={canvasRef} width={1280} height={772} />
      <div className="text-white absolute top-0 left-0">
        <p>Набросок карты</p>
        <Link to={Route.HOME}>Покинуть игру</Link>
        <h2>Подключенные пользователи:</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.username}</li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default MapRender;

import React, { useRef, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import gameMap from "@shared/assets/map/gameMap.png";
// import createEnemy from "@shared/lib/enemy.jsx";
// import { waypoints1, waypoints2 } from "@shared/data/map/paths.js";
import {
  firstPlayerPlacementTilesData,
  secondPlayerPlacementTilesData,
} from "@shared/data/map/placementTilesData.jsx";
import { GeneratePlacementTiles } from "../utils/GeneratePlacementTiles";
import { AddWizard } from "../utils/AddWizard";
import connectSocket from "../../../socket.io.js";
const MapRender = () => {
  const canvasRef = useRef(null);
  const [users, setUsers] = useState([]);
  const { gameId } = useParams();

  const [gameState, setGameState] = useState({
    firstEnemies: [],
    secondEnemies: [],
  });

  useEffect(() => {
    const socket = connectSocket();
    const username = localStorage.getItem("username");
    if (username) {
      socket.emit("joinRoom", { gameId, username });
    }

    socket.on("updateUserList", (userList) => {
      setUsers(userList);
    });

    socket.on("gameState", (state) => {
      setGameState(state);
    });

    return () => {
      socket.off("updateUserList");
      socket.off("houseColor");
      socket.off("gameState");
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

    const wizards = [];

    function animate(time) {
      requestAnimationFrame(animate);

      // const deltaTime = time - lastTime;

      // if (deltaTime > interval && enemyIndex < 9) {
      //   enemies.push(
      //     createEnemy(waypoints1[0].x, waypoints1[0].y, waypoints1, 0.5)
      //   );
      //   enemies.push(
      //     createEnemy(waypoints2[0].x, waypoints2[0].y, waypoints2, 0.5)
      //   );
      //   enemyIndex++;
      //   lastTime = time;
      // }

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

      wizards.forEach((wizard) => {
        wizard.draw(ctx);
      });
    }

    canvas.addEventListener("click", (event) => {
      if (activeTile && !activeTile.isOccupied) {
        wizards.push(AddWizard(activeTile.x, activeTile.y));
        activeTile.isOccupied = true;
      }
      console.log(wizards);
    });

    requestAnimationFrame(animate);
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
  });

  return (
    <>
      <canvas ref={canvasRef} width={1280} height={772} />
      <div className="text-white absolute top-0 left-0">
        <p>Набросок карты</p>
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

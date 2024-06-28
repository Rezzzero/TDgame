import React, { useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import gameMap from "@shared/assets/map/gameMap.png";
import {
  firstPlayerPlacementTilesData,
  secondPlayerPlacementTilesData,
} from "@shared/data/map/placementTilesData.jsx";
import { Route } from "../../../shared/constants/constants.js";
import {
  AddWizard,
  handleCanvasClick,
  activeTileFunction,
  GeneratePlacementTiles,
} from "../utils/AddWizardUtils.jsx";
import { useSocket } from "../hooks/useSocket.jsx";

const MapRender = () => {
  const canvasRef = useRef(null);
  const { gameId } = useParams();
  const { socketRef, users, gameState, user } = useSocket(gameId);

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

      const firstWizards = gameState.firstWizards.map((wizard) =>
        AddWizard(wizard.x, wizard.y)
      );
      const secondWizards = gameState.secondWizards.map((wizard) =>
        AddWizard(wizard.x, wizard.y)
      );

      const drawWizards = (wizards, ctx) => {
        wizards.forEach((wizard) => {
          wizard.draw(ctx);
          wizard.projectiles.forEach((projectile) => {
            projectile.draw(ctx);
          });
        });
      };

      drawWizards(firstWizards, ctx);
      drawWizards(secondWizards, ctx);
    }
  }, [gameState]);

  useEffect(() => {
    const handleCanvasClickWrapper = (event) => {
      handleCanvasClick(
        event,
        activeTile,
        firstPlayerTiles,
        secondPlayerTiles,
        user,
        socketRef
      );
    };

    const canvas = canvasRef.current;
    canvas.addEventListener("click", handleCanvasClickWrapper);

    return () => {
      canvas.removeEventListener("click", handleCanvasClickWrapper);
    };
  }, [activeTile, firstPlayerTiles, secondPlayerTiles, user, socketRef]);

  const mouse = {
    x: undefined,
    y: undefined,
  };

  window.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;

    activeTile =
      activeTileFunction(firstPlayerTiles, mouse) ||
      activeTileFunction(secondPlayerTiles, mouse);
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

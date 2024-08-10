import React, { useRef, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import gameMap from "../../../shared/assets/map/gameMap.png";
import {
  firstPlayerPlacementTilesData,
  secondPlayerPlacementTilesData,
} from "../../../shared/data/map/placementTilesData.jsx";
import { Route } from "../../../shared/constants/constants.js";
import {
  handleCanvasClick,
  activeTileFunction,
  GeneratePlacementTiles,
  createWizards,
} from "../utils/AddWizardUtils.jsx";
import { useSocket } from "../hooks/useSocket.jsx";
import { waypoints1, waypoints2 } from "../../../shared/data/map/paths.js";
import { EnemyComponent } from "../../Enemy/ui/EnemyComponent.jsx";
import { useGameEvents } from "../hooks/useGameEvents.jsx";

const MapRender = () => {
  const canvasRef = useRef(null);
  const { gameId } = useParams();
  const { socketRef, users, user } = useSocket(gameId);
  const [gameState, setGameState] = useState({
    firstWizards: [],
    secondWizards: [],
  });
  const [wizardShootStatus, setWizardShootStatus] = useState({
    firstWizards: [],
    secondWizards: [],
  });
  const [gameStart, setGameStart] = useState(false);
  const firstEnemyPositionsRef = useRef([]);
  const secondEnemyPositionsRef = useRef([]);
  useGameEvents(socketRef, setGameState, setGameStart);

  const firstPlayerTiles = GeneratePlacementTiles(
    firstPlayerPlacementTilesData
  );
  const secondPlayerTiles = GeneratePlacementTiles(
    secondPlayerPlacementTilesData
  );

  let activeTile = undefined;

  const handleFirstEnemies = (enemies) => {
    firstEnemyPositionsRef.current = enemies;
  };

  const handleSecondEnemies = (enemies) => {
    secondEnemyPositionsRef.current = enemies;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const image = new Image();
    image.src = gameMap;
    image.onload = () => {
      animate();
    };

    const firstWizards = createWizards(
      gameState.firstWizards,
      firstEnemyPositionsRef.current,
      wizardShootStatus.firstWizards,
      (shooted) =>
        setWizardShootStatus((prev) => ({
          ...prev,
          firstWizards: [...prev.firstWizards, shooted],
        }))
    );

    const secondWizards = createWizards(
      gameState.secondWizards,
      secondEnemyPositionsRef.current,
      wizardShootStatus.secondWizards,
      (shooted) =>
        setWizardShootStatus((prev) => ({
          ...prev,
          secondWizards: [...prev.secondWizards, shooted],
        }))
    );

    function animate() {
      if (!gameStart) return;

      requestAnimationFrame(animate);

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      const drawEnemies = (enemies, ctx) => {
        enemies.forEach((pos) => {
          ctx.fillStyle = "red";
          ctx.beginPath();
          ctx.arc(pos.x + 5, pos.y + 5, 5, 0, 2 * Math.PI);
          ctx.fill();
        });
      };

      drawEnemies(firstEnemyPositionsRef.current, ctx);
      drawEnemies(secondEnemyPositionsRef.current, ctx);

      firstPlayerTiles.forEach((tile) => {
        tile.update(ctx, mouse);
      });

      secondPlayerTiles.forEach((tile) => {
        tile.update(ctx, mouse);
      });

      const drawWizards = (wizards, enemies, ctx) => {
        wizards.forEach((wizard) => {
          wizard.draw(ctx);
          wizard.target = null;

          const validEnemies = enemies.current.filter((enemy) => {
            const dx = enemy.x - wizard.x;
            const dy = enemy.y - wizard.y;
            const distance = Math.hypot(dx, dy);
            return distance < enemy.radius + wizard.radius * 0.7;
          });
          console.log("valid enemies", validEnemies);

          wizard.projectiles.forEach((projectile) => {
            projectile.update(ctx);
          });
        });
      };

      drawWizards(firstWizards, firstEnemyPositionsRef, ctx);
      drawWizards(secondWizards, secondEnemyPositionsRef, ctx);
    }
    image.onload = () => {
      animate();
    };
  }, [gameState, firstEnemyPositionsRef, secondEnemyPositionsRef, gameStart]);

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
      {!gameStart ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-50">
          <Oval color="#00BFFF" height={80} width={80} />
          <p className="text-white mt-4 text-lg">Ожидание противника...</p>
        </div>
      ) : (
        <>
          <EnemyComponent
            handleEnemies={handleFirstEnemies}
            waypoints={waypoints2}
            speed={1}
          />
          <EnemyComponent
            handleEnemies={handleSecondEnemies}
            waypoints={waypoints1}
            speed={1}
          />
        </>
      )}
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

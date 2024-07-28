import React, { useRef, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import gameMap from "../../../shared/assets/map/gameMap.png";
import {
  firstPlayerPlacementTilesData,
  secondPlayerPlacementTilesData,
} from "../../../shared/data/map/placementTilesData.jsx";
import { Route } from "../../../shared/constants/constants.js";
import {
  AddWizard,
  handleCanvasClick,
  activeTileFunction,
  GeneratePlacementTiles,
} from "../utils/AddWizardUtils.jsx";
import { createEnemy } from "../utils/enemyUtils.jsx";
import { useSocket } from "../hooks/useSocket.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setGameState } from "../model/gameSlice.jsx";
import { waypoints1, waypoints2 } from "../../../shared/data/map/paths.js";
import { EnemyComponent } from "../../Enemy/ui/EnemyComponent.jsx";

const MapRender = () => {
  const canvasRef = useRef(null);
  const { gameId } = useParams();
  const { socketRef, users, user } = useSocket(gameId);
  const dispatch = useDispatch();
  const gameState = useSelector((state) => state.game);
  const [firstEnemies, setFirstEnemies] = useState([]);
  const [secondEnemies, setSecondEnemies] = useState([]);
  const enemyPositionsRef = useRef([]);

  const firstPlayerTiles = GeneratePlacementTiles(
    firstPlayerPlacementTilesData
  );
  const secondPlayerTiles = GeneratePlacementTiles(
    secondPlayerPlacementTilesData
  );

  let activeTile = undefined;

  const handleEnemies = (enemies) => {
    enemyPositionsRef.current = enemies;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const image = new Image();
    image.src = gameMap;
    image.onload = () => {
      animate();
    };

    const firstWizards = gameState.firstWizards.map((wizard) =>
      AddWizard(wizard.x, wizard.y, enemyPositionsRef.current)
    );
    const secondWizards = gameState.secondWizards.map((wizard) =>
      AddWizard(wizard.x, wizard.y, firstEnemies)
    );

    function animate() {
      requestAnimationFrame(animate);

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Отрисовка врагов из состояния
      enemyPositionsRef.current.forEach((pos) => {
        ctx.fillStyle = "red";
        ctx.fillRect(pos.x, pos.y, 10, 20); // Отрисовка врага с размерами 10x20
      });

      firstPlayerTiles.forEach((tile) => {
        tile.update(ctx, mouse);
      });

      secondPlayerTiles.forEach((tile) => {
        tile.update(ctx, mouse);
      });

      const drawWizards = (wizards, ctx) => {
        wizards.forEach((wizard) => {
          wizard.draw(ctx);

          wizard.projectiles.forEach((projectile) => {
            projectile.update(ctx);
          });
        });
      };

      drawWizards(firstWizards, ctx);
      drawWizards(secondWizards, ctx);
    }
  }, [gameState]);

  useEffect(() => {
    const handleGameStateUpdate = (gameState) => {
      dispatch(setGameState(gameState));
    };

    const handleGameStarted = () => {
      const enemy1 = createEnemy(
        waypoints1[0].x,
        waypoints1[0].y,
        waypoints1,
        0.2
      );
      const enemy2 = createEnemy(
        waypoints2[0].x,
        waypoints2[0].y,
        waypoints2,
        0.2
      );

      setFirstEnemies([enemy1]);
      setSecondEnemies([enemy2]);
    };

    const socket = socketRef.current;
    socket.on("gameState", handleGameStateUpdate);
    socket.on("gameStarted", handleGameStarted);

    return () => {
      socket.off("gameState", handleGameStateUpdate);
      socket.off("gameStarted", handleGameStarted);
    };
  }, [dispatch, socketRef]);

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
      <EnemyComponent
        handleEnemies={handleEnemies}
        waypoints={waypoints2}
        speed={1}
      />
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

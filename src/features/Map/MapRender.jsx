import React, { useRef, useEffect } from "react";
import gameMap from "@shared/assets/map/gameMap.png";
import createEnemy from "@shared/lib/enemy.jsx";
import { waypoints1, waypoints2 } from "@shared/data/map/paths.jsx";
import {
  firstPlayerPlacementTilesData,
  secondPlayerPlacementTilesData,
} from "@shared/data/map/placementTilesData.jsx";
import { GeneratePlacementTiles } from "./GeneratePlacementTiles";
const MapRender = () => {
  const canvasRef = useRef(null);

  const firstPlayerTiles = GeneratePlacementTiles(
    firstPlayerPlacementTilesData
  );
  const secondPlayerTiles = GeneratePlacementTiles(
    secondPlayerPlacementTilesData
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const image = new Image();
    image.src = gameMap;
    image.onload = () => {
      animate();
    };

    const enemies = [];
    let lastTime = 0;
    const interval = 500;
    let enemyIndex = 0;

    function animate(time) {
      requestAnimationFrame(animate);

      const deltaTime = time - lastTime;

      if (deltaTime > interval && enemyIndex < 9) {
        enemies.push(
          createEnemy(waypoints1[0].x, waypoints1[0].y, waypoints1, 0.5)
        );
        enemies.push(
          createEnemy(waypoints2[0].x, waypoints2[0].y, waypoints2, 0.5)
        );
        enemyIndex++;
        lastTime = time;
      }

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      enemies.forEach((enemy) => {
        enemy.update();
        enemy.draw(ctx);
      });

      firstPlayerTiles.forEach((tile) => {
        tile.update(ctx, mouse);
      });

      secondPlayerTiles.forEach((tile) => {
        tile.update(ctx, mouse);
      });
    }

    requestAnimationFrame(animate);
  }, []);

  const mouse = {
    x: undefined,
    y: undefined,
  };

  window.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  });

  return <canvas ref={canvasRef} width={1280} height={772} />;
};

export default MapRender;

import React, { useRef, useEffect } from "react";
import gameMap from "@shared/assets/map/gameMap.png";
import createEnemy from "@shared/lib/enemy.jsx";
import { waypoints1, waypoints2 } from "@shared/data/paths.jsx";

const MapRender = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const image = new Image();
    image.src = gameMap;
    image.onload = () => {
      animate();
    };

    const enemies = [];

    for (let i = 1; i < 10; i++) {
      const time = i * 500;
      setTimeout(() => {
        enemies.push(createEnemy(waypoints1[0].x, waypoints1[0].y, waypoints1));
      }, time);

      setTimeout(() => {
        enemies.push(createEnemy(waypoints2[0].x, waypoints2[0].y, waypoints2));
      }, time);
    }

    function animate() {
      requestAnimationFrame(animate);

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      enemies.forEach((enemy) => {
        enemy.update();
        enemy.draw(ctx);
      });
    }
  }, []);

  return <canvas ref={canvasRef} width={1280} height={772} />;
};

export default MapRender;

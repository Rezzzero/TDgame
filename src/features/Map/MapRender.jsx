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

    const enemies = [
      createEnemy(waypoints1[0].x, waypoints1[0].y, waypoints1),
      createEnemy(waypoints2[0].x, waypoints2[0].y, waypoints2),
      createEnemy(waypoints1[0].x, waypoints1[0].y, waypoints1),
    ];

    function animate() {
      requestAnimationFrame(animate);

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      enemies.forEach((enemy) => {
        enemy.update();
        enemy.draw(ctx);
      });
    }
  }, []);

  return <canvas ref={canvasRef} width={1280} height={720} />;
};

export default MapRender;

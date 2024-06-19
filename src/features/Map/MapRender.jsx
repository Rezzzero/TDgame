import React, { useRef, useEffect } from "react";
import gameMap from "@shared/assets/map/gameMap.png";
import createEnemy from "@shared/lib/enemy.jsx";

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
      createEnemy(600, 200, 1),
      createEnemy(600, 200, 1.5),
      createEnemy(600, 200, 2),
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

import { useState, useEffect } from "react";

export const createEnemy = (initialX, initialY, waypoints, speed) => {
  let x = initialX;
  let y = initialY;
  let width = 10;
  let height = 20;
  let waypointIndex = 0;
  let center = {
    x: x + width / 2,
    y: y + height / 2,
  };

  const update = () => {
    const waypoint = waypoints[waypointIndex];
    const yDistance = waypoint.y - center.y;
    const xDistance = waypoint.x - center.x;
    const angle = Math.atan2(yDistance, xDistance);

    x += Math.cos(angle) * speed;
    y += Math.sin(angle) * speed;
    center = {
      x: x + width / 2,
      y: y + height / 2,
    };

    if (
      Math.round(center.x) === Math.round(waypoint.x) &&
      Math.round(center.y) === Math.round(waypoint.y) &&
      waypointIndex < waypoints.length - 1
    ) {
      waypointIndex++;
    }

    return { x, y, width, height, waypointIndex, center };
  };

  return { x, y, update };
};

export const EnemyComponent = ({ handleEnemies, waypoints, speed }) => {
  const [enemies, setEnemies] = useState([]);

  useEffect(() => {
    if (waypoints.length > 0) {
      const initialEnemies = [
        createEnemy(waypoints[0].x, waypoints[0].y, waypoints, speed),
      ];
      setEnemies(initialEnemies);
    }
  }, [waypoints, speed]);

  useEffect(() => {
    if (enemies.length > 0) {
      const intervalId = setInterval(() => {
        const updatedEnemies = enemies.map((enemy) => {
          const updatedEnemy = enemy.update();
          return { ...enemy, ...updatedEnemy };
        });
        setEnemies(updatedEnemies);
        handleEnemies(
          updatedEnemies.map((enemy) => ({ x: enemy.x, y: enemy.y }))
        );
      }, 100);

      return () => clearInterval(intervalId);
    }
  }, [enemies, handleEnemies]);

  return null;
};

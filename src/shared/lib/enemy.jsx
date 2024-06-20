const createEnemy = (initialX, initialY, waypoints) => {
  let x = initialX;
  let y = initialY;

  const update = () => {
    const waypoint = waypoints[0];
    const yDistance = waypoint.y - y;
    const xDistance = waypoint.x - x;
    const angle = Math.atan2(yDistance, xDistance);

    x += Math.cos(angle);
    y += Math.sin(angle);
  };

  const draw = (ctx) => {
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, 10, 20);
  };

  return { update, draw };
};

export default createEnemy;

const createEnemy = (initialX, initialY, waypoints) => {
  let x = initialX;
  let y = initialY;
  let waypointIndex = 0;

  const update = () => {
    const waypoint = waypoints[waypointIndex];
    const yDistance = waypoint.y - y;
    const xDistance = waypoint.x - x;
    const angle = Math.atan2(yDistance, xDistance);

    x += Math.cos(angle);
    y += Math.sin(angle);

    if (
      Math.round(x) === Math.round(waypoint.x) &&
      Math.round(y) === Math.round(waypoint.y) &&
      waypointIndex < waypoints.length - 1
    ) {
      waypointIndex++;
    }
  };

  const draw = (ctx) => {
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, 10, 20);
  };

  return { update, draw };
};

export default createEnemy;

const createEnemy = (initialX, initialY, waypoints) => {
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

    x += Math.cos(angle);
    y += Math.sin(angle);
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
  };

  const draw = (ctx) => {
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, width, height);
  };

  return { update, draw };
};

export default createEnemy;

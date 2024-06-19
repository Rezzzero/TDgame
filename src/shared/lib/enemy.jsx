const createEnemy = (initialX, initialY, speed) => {
  let x = initialX;
  let y = initialY;

  const update = () => {
    y += speed;
  };

  const draw = (ctx) => {
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, 10, 20);
  };

  return { update, draw };
};

export default createEnemy;

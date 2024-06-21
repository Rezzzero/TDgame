export const PlacementTile = (x, y) => {
  const size = 32;
  let color = "rgba(255, 255, 255, 0.3)";

  const draw = (ctx) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
  };

  const update = (ctx, mouse) => {
    draw(ctx);
    if (
      mouse.x > x &&
      mouse.x < x + size &&
      mouse.y > y &&
      mouse.y < y + size
    ) {
      console.log("colliding");
    }
  };

  return { x, y, size, update };
};

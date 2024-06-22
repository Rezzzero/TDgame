export const AddWizard = (x, y) => {
  const width = 32 * 2;
  const draw = (ctx) => {
    ctx.fillStyle = "blue";
    ctx.fillRect(x, y, width, 32);
  };

  return { x, y, draw };
};

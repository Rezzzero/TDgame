export const AddWizard = (x, y) => {
  const width = 32 * 2;
  const draw = (ctx) => {
    ctx.fillStyle = "blue";
    ctx.fillRect(x, y, width, 32);
  };

  return { x, y, draw };
};

export const handleCanvasClick = (
  event,
  activeTile,
  firstPlayerTiles,
  secondPlayerTiles,
  socketRef
) => {
  if (activeTile && !activeTile.isOccupied) {
    const playerType = localStorage.getItem("playerType");

    const isFirstPlayerTile = firstPlayerTiles.includes(activeTile);
    const isSecondPlayerTile = secondPlayerTiles.includes(activeTile);

    if (
      (playerType === "firstPlayer" && isFirstPlayerTile) ||
      (playerType === "secondPlayer" && isSecondPlayerTile)
    ) {
      const wizard = { x: activeTile.x, y: activeTile.y };
      console.log("playerType", playerType);
      socketRef.current.emit("placeWizard", { wizard, playerType });
      activeTile.isOccupied = true;
    }
  }
};

export const activeTileFunction = (arr, mouse) => {
  for (let i = 0; i < arr.length; i++) {
    const tile = arr[i];
    if (
      mouse.x > tile.x &&
      mouse.x < tile.x + tile.size &&
      mouse.y > tile.y &&
      mouse.y < tile.y + tile.size
    ) {
      return tile;
    }
  }
  return null;
};

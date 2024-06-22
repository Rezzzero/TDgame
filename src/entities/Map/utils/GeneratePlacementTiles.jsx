import { PlacementTile } from "./PlacementTile";

export const GeneratePlacementTiles = (placementTilesData) => {
  const tilesGrid = [];

  for (let i = 0; i < placementTilesData.length; i += 40) {
    tilesGrid.push(placementTilesData.slice(i, i + 40));
  }

  const tiles = [];

  tilesGrid.forEach((row, y) => {
    row.forEach((symbol, x) => {
      if (symbol === 451) {
        tiles.push(PlacementTile(x * 32, y * 32));
      }
    });
  });

  return tiles;
};

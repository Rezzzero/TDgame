import grass from "../../assets/tile/medievalTile_58.png";
import path from "../../assets/tile/medievalTile_13.png";
import dirt from "../../assets/tile/medievalTile_14.png";

const generateMap = (width, height) => {
  const map = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ({ type: grass, structure: null }))
  );

  const house1X = 3;
  const house1Y = 2;
  const house2X = width - 5;
  const house2Y = height - 6;

  map[house1Y][house1X].structure = { type: "house", level: 1 };
  map[house2Y][house2X].structure = { type: "house", level: 1 };

  //generate 2 areas for main building
  const setArea = (startX, startY, width, height, tileType) => {
    for (let y = startY; y < startY + height; y++) {
      for (let x = startX; x < startX + width; x++) {
        map[y][x].type = tileType;
      }
    }
  };

  setArea(house1X, house1Y + 1, 4, 4, dirt);
  setArea(house2X - 2, house2Y - 1, 4, 4, dirt);

  //generate main path
  const generateDiagonalPath = (startX, startY, endX, endY, tileType) => {
    let x = startX;
    let y = startY;

    const dx = endX > startX ? 1 : -1;
    const dy = endY > startY ? 1 : -1;

    while (x !== endX && y !== endY) {
      map[y + 1][x].type = tileType;
      map[y + 1][x - 1].type = tileType;
      map[y][x].type = tileType;
      x += dx;
      y += dy;
    }
  };

  generateDiagonalPath(house1X + 1, house1Y + 1, house2X, house2Y, path);

  let startX = house1X + 1;
  let startY = house1Y + 1;
  let endX = house2X + 1;
  let endY = house2Y + 1;

  //generate side paths
  const setSidePaths = (startX, startY, endX, endY, tileType) => {
    for (let x = startX; x <= endX; x++) {
      map[startY][x].type = tileType;
      map[endY + 1][x].type = tileType;
    }
    for (let y = startY; y <= endY; y++) {
      map[y + 1][startX].type = tileType;
      map[y][endX].type = tileType;
    }
  };

  setSidePaths(startX - 1, startY, endX, endY, path);

  return map;
};

export default generateMap;

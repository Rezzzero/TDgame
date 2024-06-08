import React from "react";
import medievalTile_58 from "../../assets/tile/medievalTile_58.png";
import medievalTile_27 from "../../assets/tile/medievalTile_27.png";

const tileTypes = {
  grass: medievalTile_58,
  water: medievalTile_27,
};

const generateMap = (width, height) => {
  const map = [];

  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      let tile = tileTypes.water;

      //Создание участков земли
      if (x > 4 && x < 15 && y > 4 && y < 15) {
        tile = tileTypes.grass;
      }

      row.push(tile);
    }

    map.push(row);
  }

  return map;
};

const Map = ({ width, height }) => {
  const map = generateMap(width, height);

  return (
    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
      <div className="flex flex-col relative">
        {map.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((tile, tileIndex) => (
              <div key={tileIndex} className="w-[32px] h-[32px]">
                <img src={tile} alt="tile" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Map;

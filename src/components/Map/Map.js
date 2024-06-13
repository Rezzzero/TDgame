import { useState } from "react";
import grass from "../../assets/tile/medievalTile_58.png";
import House from "../Structure/House/House.js";

const generateMap = (width, height) => {
  const map = [];

  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      let tile = grass;

      row.push({ type: tile, structure: null });
    }

    map.push(row);
  }

  map[2][3].structure = { type: "house", level: 1 };
  map[height - 6][width - 5].structure = { type: "house", level: 1 };

  return map;
};

const Map = ({ width, height }) => {
  const [map, setMap] = useState(generateMap(width, height));

  const handleUpgrade = (x, y) => {
    const newMap = map.map((row, rowIndex) => {
      if (rowIndex !== y) return row;
      return row.map((tile, tileIndex) => {
        if (tileIndex !== x) return tile;
        const newLevel = (tile.structure.level % 2) + 1;
        return { ...tile, structure: { ...tile.structure, level: newLevel } };
      });
    });
    setMap(newMap);
  };

  return (
    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
      <div className="flex flex-col relative">
        {map.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((tile, tileIndex) => (
              <div
                key={tileIndex}
                className="w-[28px] h-[28px] relative border border-2 border-black"
              >
                <img src={tile.type} alt="tile" className="w-full h-full" />
                {tile.structure && tile.structure.type === "house" && (
                  <House
                    level={tile.structure.level}
                    index={{ x: tileIndex, y: rowIndex }}
                    onUpgrade={() => handleUpgrade(tileIndex, rowIndex)}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Map;

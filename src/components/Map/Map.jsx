import { useState } from "react";
import House from "../Structure/House/House.jsx";
import generateMap from "../../shared/MapUtils/mapUtils.jsx";
import React from "react";

const Map = ({ width, height, houseColor }) => {
  const [map, setMap] = useState(() => generateMap(width, height));

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
                className="w-[28px] h-[28px] relative border-2 border-black"
              >
                <img src={tile.type} alt="tile" className="w-full h-full" />
                {tile.structure && tile.structure.type === "house" && (
                  <House
                    level={tile.structure.level}
                    index={{ x: tileIndex, y: rowIndex }}
                    houseColor={houseColor}
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

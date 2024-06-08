import React, { useState } from "react";
import medievalTile_58 from "../../assets/tile/medievalTile_58.png";
import medievalTile_27 from "../../assets/tile/medievalTile_27.png";
import { useDrop } from "react-dnd";
import House from "../Structure/House/House";

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
      if (x > 4 && x < 25 && y > 4 && y < 25) {
        tile = tileTypes.grass;
      }

      row.push(tile);
    }

    map.push(row);
  }

  return map;
};

const Map = ({ width, height }) => {
  const [houses, setHouses] = useState([{ id: 1, left: 200, top: 200 }]);

  const [, drop] = useDrop(
    () => ({
      accept: "house",
      drop: (item, monitor) => {
        const delta = monitor.getDifferenceFromInitialOffset();
        const left = Math.round(item.left + delta.x);
        const top = Math.round(item.top + delta.y);
        moveHouse(item.id, left, top);
      },
    }),
    [houses]
  );

  const moveHouse = (id, left, top) => {
    setHouses((prevHouses) =>
      prevHouses.map((house) =>
        house.id === id ? { ...house, left, top } : house
      )
    );
  };
  const map = generateMap(width, height);

  return (
    <div ref={drop}>
      <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <div className="flex flex-col relative">
          {map.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((tile, tileIndex) => (
                <div key={tileIndex} className="w-[28px] h-[28px]">
                  <img
                    src={tile}
                    alt="tile"
                    className="border border-2 border-black "
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {houses.map((house) => (
        <House key={house.id} id={house.id} left={house.left} top={house.top} />
      ))}
    </div>
  );
};

export default Map;

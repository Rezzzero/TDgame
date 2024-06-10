import grass from "../../assets/tile/medievalTile_58.png";
import water from "../../assets/tile/medievalTile_27.png";

const generateMap = (width, height) => {
  const map = [];

  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      let tile = water;

      //Создание участков земли
      if (x > 4 && x < 25 && y > 4 && y < 25) {
        tile = grass;
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
  );
};

export default Map;

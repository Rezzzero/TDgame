import React from "react";
import "./Map.css";
import medievalTile_58 from "../../assets/tile/medievalTile_58.png";
import medievalTile_57 from "../../assets/tile/medievalTile_57.png";

const Map = ({ width, height }) => {
  const tiles = Array.from({ length: width * height }, (_, index) => index);

  return (
    <div className="map">
      {tiles.map((tileIndex) => (
        <div key={tileIndex} className="map-tile">
          {tileIndex % 2 === 0 ? (
            <img src={medievalTile_58} alt="mediadelTile_58" />
          ) : (
            <img src={medievalTile_57} alt="mediadelTile_57" />
          )}
        </div>
      ))}
    </div>
  );
};

export default Map;

import Map from "@entities/Map/Map.jsx";
import React from "react";
import MapRender from "@entities/Map/model/MapRender.jsx";

const Game = () => {
  return (
    <>
      <MapRender />
      {/* <Map width={30} height={30} houseColor={houseColor} /> */}
    </>
  );
};

export default Game;

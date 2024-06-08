import medievalStructure_17 from "../../../assets/structure/medievalStructure_17.png";
import medievalStructure_18 from "../../../assets/structure/medievalStructure_18.png";
import { useRef, useState } from "react";
import Modal from "../../../shared/Modal/Modal";
const structureTypes = {
  houseLvl1: medievalStructure_18,
  houseLvl2: medievalStructure_17,
};
const House = () => {
  const [openHouseInfo, setOpenHouseInfo] = useState(false);
  const [currentHouse, setCurrentHouse] = useState(structureTypes.houseLvl1);
  const [isDragging, setIsDragging] = useState(false);
  const [wasMoved, setWasMoved] = useState(false);
  const [position, setPosition] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const houseRef = useRef(null);

  const handleMouseDown = (event) => {
    if (!openHouseInfo) {
      setIsDragging(true);
      setWasMoved(true);
      const rect = houseRef.current.getBoundingClientRect();
      if (rect) {
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;
        setPosition((prevPosition) => ({
          x: prevPosition.x + offsetX,
          y: prevPosition.y + offsetY,
        }));
      }
    }
  };

  const handleMouseMove = (event) => {
    if (!openHouseInfo) {
      if (isDragging) {
        const rect = houseRef.current?.getBoundingClientRect();
        if (rect) {
          const offsetX = event.clientX - rect.left;
          const offsetY = event.clientY - rect.top;
          setPosition((prevPosition) => ({
            x: prevPosition.x + offsetX,
            y: prevPosition.y + offsetY,
          }));
        }
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setWasMoved(false);
    //add logic to update the position by map's cells of the house
  };

  const handleOpenHouseInfo = () => {
    if (!isDragging && !wasMoved) {
      setOpenHouseInfo(!openHouseInfo);
    }
  };

  const handleUpgrade = () => {
    if (currentHouse === structureTypes.houseLvl1) {
      setCurrentHouse(structureTypes.houseLvl2);
    }
    setOpenHouseInfo(false);
  };

  return (
    <div
      ref={houseRef}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        zIndex: 1,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={(event) => handleMouseDown(event)}
      onMouseMove={(event) => handleMouseMove(event)}
      onMouseUp={() => handleMouseUp()}
    >
      <div
        onClick={() => handleOpenHouseInfo()}
        className="w-[100px] h-[100px] absolute top-[51%] left-[51%] translate-x-[-50%] translate-y-[-50%] z-1 cursor-pointer"
      >
        <img
          src={currentHouse}
          alt="house"
          className="transition-transform duration-300 ease-in-out hover:scale-110"
        />
      </div>
      {openHouseInfo && (
        <Modal
          handleOpenHouseInfo={handleOpenHouseInfo}
          upgradeMain={handleUpgrade}
        >
          <h2 className="text-xl mb-4">House Information</h2>
          <p>Some information about the house...</p>
        </Modal>
      )}
    </div>
  );
};

export default House;

import houseLvl2 from "../../../assets/structure/medievalStructure_17.png";
import houseLvl1 from "../../../assets/structure/medievalStructure_18.png";
import { useState } from "react";
import Modal from "../../../shared/Modal/Modal.js";

const House = () => {
  const [openHouseInfo, setOpenHouseInfo] = useState(false);
  const [currentHouse, setCurrentHouse] = useState(houseLvl1);
  const handleOpenHouseInfo = () => {
    setOpenHouseInfo(!openHouseInfo);
  };

  const handleUpgrade = () => {
    if (currentHouse === houseLvl1) {
      setCurrentHouse(houseLvl2);
    }
    setOpenHouseInfo(false);
  };

  return (
    <>
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
    </>
  );
};

export default House;

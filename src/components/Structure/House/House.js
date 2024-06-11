import houseLvl2 from "../../../assets/structure/medievalStructure_17.png";
import houseLvl1 from "../../../assets/structure/medievalStructure_18.png";
import { useState } from "react";
import Modal from "../../../shared/Modal/Modal.js";

const House = ({ leftSide, border }) => {
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
        className={`w-[100px] h-[100px] absolute ${
          leftSide ? "top-[65%] left-[39%]" : "top-[27%] right-[37%]"
        } ${
          border === "blue"
            ? "border-b-2 border-blue-500"
            : "border-b-2 border-red-500"
        } z-10 cursor-pointer`}
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

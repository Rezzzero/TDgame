import houseLvl2 from "../../../assets/structure/medievalStructure_17.png";
import houseLvl1 from "../../../assets/structure/medievalStructure_18.png";
import houseBlueLvl1 from "../../../assets/structure/medievalStructureBlue_18.png";
import houseRedLvl1 from "../../../assets/structure/medievalStructureRed_18.png";
import { useState } from "react";
import Modal from "../../../shared/Modal/Modal.js";

const House = ({ level, index, houseColor, onUpgrade }) => {
  const houseImages = {
    1: houseLvl1,
    2: houseLvl2,
  };

  let houseImage;
  if (index.x === 3 && index.y === 2) {
    houseImage = houseColor === "blue" ? houseBlueLvl1 : houseRedLvl1;
  } else if (index.x === 25 && index.y === 24) {
    houseImage = houseColor === "blue" ? houseRedLvl1 : houseBlueLvl1;
  } else {
    houseImage = houseImages[level];
  }

  const [openHouseInfo, setOpenHouseInfo] = useState(false);

  const handleOpenHouseInfo = () => {
    setOpenHouseInfo(!openHouseInfo);
  };

  return (
    <>
      <div
        onClick={handleOpenHouseInfo}
        className="w-[50px] h-[50px] absolute z-10 cursor-pointer hover:scale-110 duration-300"
      >
        <img src={houseImage} alt="house" className="w-full h-full" />
      </div>
      {openHouseInfo && (
        <Modal
          handleOpenHouseInfo={handleOpenHouseInfo}
          upgradeMain={onUpgrade}
        >
          <h2 className="text-xl mb-4">House Information</h2>
          <p>Some information about the house...</p>
        </Modal>
      )}
    </>
  );
};

export default House;

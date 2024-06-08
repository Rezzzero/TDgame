import medievalStructure_17 from "../../../assets/structure/medievalStructure_17.png";

const structureTypes = {
  house: medievalStructure_17,
};
const House = () => {
  return (
    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-10">
      <img src={structureTypes.house} alt="house" />
    </div>
  );
};

export default House;

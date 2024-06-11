import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <h1>Лобби</h1>
      <Link to="/game">Присоединиться к игре</Link>
    </>
  );
};

export default Home;

import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <h1>Lobby</h1>
      <Link to="/game">Join game</Link>
    </>
  );
};

export default Home;

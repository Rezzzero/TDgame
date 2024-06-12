import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);

  const fetchRooms = () => {
    fetch("http://localhost:8080/rooms")
      .then((response) => response.json())
      .then((data) => setRooms(data))
      .catch((error) => console.error("Error fetching rooms:", error));
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  function createGame() {
    const name = prompt("Создать игру");
    if (name) {
      const gameId = encodeURIComponent(name);
      navigate(`/game/${gameId}`);
    }
  }
  return (
    <>
      <h1>Лобби</h1>
      <button onClick={createGame} type="button" className="block">
        Создать игру
      </button>
      <button onClick={fetchRooms} type="button" className="block">
        Обновить список комнат
      </button>
      <h2>Существующие комнаты:</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room}>
            <Link to={`/game/${room}`}>{decodeURIComponent(room)}</Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Home;

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import React from "react";

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
    const username = prompt("Введите ваш никнейм:");
    if (!username) return;

    const roomName = prompt("Введите название комнаты:");
    if (!roomName) return;

    localStorage.setItem("username", username);
    const gameId = encodeURIComponent(roomName);
    navigate(`/game/${gameId}`);
  }

  const joinRoomWithUsername = (roomName) => {
    const username = prompt("Введите ваш никнейм:");
    if (!username) return;

    localStorage.setItem("username", username);
    const gameId = encodeURIComponent(roomName);
    navigate(`/game/${gameId}`);
  };

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
            <button onClick={() => joinRoomWithUsername(room)}>
              комната: {decodeURIComponent(room)}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Home;

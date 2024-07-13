import { useRooms } from "../../entities/Room/model/useRooms";
import RoomList from "../../entities/Room/ui/RoomList";
import CreateGameButton from "../../features/CreateGame/ui/CreateGameButton";
import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { rooms, reloadRooms } = useRooms();
  const navigate = useNavigate();

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
      <CreateGameButton />
      <button onClick={reloadRooms} type="button" className="block">
        Обновить список комнат
      </button>
      <h2>Существующие комнаты:</h2>
      <RoomList rooms={rooms} onJoin={joinRoomWithUsername} />
    </>
  );
};

export default Home;

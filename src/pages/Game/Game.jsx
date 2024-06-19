import Map from "../../features/Map/Map.jsx";
import connectSocket from "../../socket.io.js";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import React from "react";
import MapRender from "@features/Map/MapRender.jsx";

const Game = () => {
  const { gameId } = useParams();
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]);
  const [houseColor, setHouseColor] = useState(null);

  useEffect(() => {
    const socketInstance = connectSocket();
    setSocket(socketInstance);

    const username = localStorage.getItem("username");
    if (!username) return;

    socketInstance.on("connect", () => {
      socketInstance.emit("joinRoom", { gameId, username });
    });

    socketInstance.on("updateUserList", (userList) => {
      setUsers(userList);
    });

    socketInstance.on("houseColor", (houseColor) => {
      console.log("Received house color:", houseColor);
      setHouseColor(houseColor);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [gameId]);

  return (
    <>
      {/* <Map width={30} height={30} houseColor={houseColor} /> */}
      <MapRender />
      <div className="text-white absolute top-0 left-0">
        <p>Набросок карты</p>
        <Link to="/">Покинуть игру</Link>
        <h2>Подключенные пользователи:</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.username}</li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Game;

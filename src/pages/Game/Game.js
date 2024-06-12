import House from "../../components/Structure/House/House.js";
import Map from "../../components/Map/Map.js";
import connectSocket from "../../socket.io.js";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const Game = () => {
  const { gameId } = useParams();
  const [socket, setSocket] = useState(null);
  const [borderFirstHouse, setBorderFirstHouse] = useState("blue");
  const [borderSecondHouse, setBorderSecondHouse] = useState("red");
  const [users, setUsers] = useState([]);

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

    return () => {
      socketInstance.disconnect();
    };
  }, [gameId]);

  useEffect(() => {
    if (socket) {
      socket.on("houseColor", (color) => {
        setBorderFirstHouse(color);
      });
      socket.on("houseColor2", (color) => {
        setBorderSecondHouse(color);
      });
    }
  }, [socket]);

  return (
    <>
      <p>Набросок карты</p>
      <Link to="/">Покинуть игру</Link>
      <Map width={30} height={30} />
      <House leftSide={true} border={borderFirstHouse} />
      <House leftSide={false} border={borderSecondHouse} />
      <div>
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

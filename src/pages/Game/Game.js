import House from "../../components/Structure/House/House.js";
import Map from "../../components/Map/Map.js";
import connectSocket from "../../socket.io.js";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const Game = () => {
  const { gameId } = useParams();
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const [borderFirstHouse, setBorderFirstHouse] = useState("blue");
  const [borderSecondHouse, setBorderSecondHouse] = useState("red");

  useEffect(() => {
    const socketInstance = connectSocket();
    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      setConnected(true);
      socketInstance.emit("joinRoom", gameId);
    });

    socketInstance.on("message", (msg) => {
      console.log("Received message from server:", msg);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

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
    </>
  );
};

export default Game;

import House from "../../components/Structure/House/House.js";
import Map from "../../components/Map/Map.js";
import connectSocket from "../../socket.io.js";
import { useEffect, useState } from "react";

const Game = () => {
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = connectSocket(); // вызываем функцию для получения объекта сокета
    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Connected with socket ID:", socketInstance.id);
      setConnected(true);
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
      socket.emit("message", "Hello from client!");
    }
  }, [socket]);
  return (
    <>
      <p>Набросок карты</p>
      <Map width={30} height={30} />
      {connected && <House />}
    </>
  );
};

export default Game;

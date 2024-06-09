import House from "./components/Structure/House/House";
import Map from "./components/Map/Map";
import socket from "./socket.io";
import { useEffect, useState } from "react";
function App() {
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    socket.emit("message", "Hello from client!");

    socket.on("message", (msg) => {
      console.log("Received message from server:", msg);
    });

    socket.on("connect", () => {
      setTimeout(() => {
        setConnected(true);
      }, 2000);
    });

    if (socket === undefined) return () => socket.disconnect();
  }, []);

  return (
    <div className="App container">
      <p>Набросок карты</p>
      <Map width={30} height={30} />
      {connected && <House />}
    </div>
  );
}

export default App;

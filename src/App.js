import House from "./components/Structure/House/House";
import Map from "./components/Map/Map";
import socket from "./socket.io";
import { useEffect } from "react";
function App() {
  useEffect(() => {
    socket.emit("message", "Hello from client!");

    socket.on("message", (msg) => {
      console.log("Received message from server:", msg);
    });

    if (socket === undefined) return () => socket.disconnect();
  }, []);

  return (
    <div className="App container">
      <p>Набросок карты</p>
      <Map width={30} height={30} />
      <House />
    </div>
  );
}

export default App;

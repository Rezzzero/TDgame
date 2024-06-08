import Map from "./components/Map/Map";
import House from "./components/Structure/House/House";

function App() {
  return (
    <div className="App container">
      <p>Набросок карты</p>
      <Map width={20} height={20} />
      <House />
    </div>
  );
}

export default App;

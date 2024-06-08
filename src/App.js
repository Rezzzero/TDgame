import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Map from "./components/Map/Map";

function App() {
  return (
    <div className="App container">
      <p>Набросок карты</p>
      <DndProvider backend={HTML5Backend}>
        <Map width={30} height={30} />
      </DndProvider>
    </div>
  );
}

export default App;

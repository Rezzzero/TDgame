import { createBrowserRouter } from "react-router-dom";
import { Route } from "../shared/constants/constants.js";
import App from "../App.js";
import Home from "../pages/Home/Home.js";
import Game from "../pages/Game/Game.js";

export const router = createBrowserRouter([
  {
    path: Route.HOME,
    element: <App />,
    children: [
      {
        path: Route.HOME,
        element: <Home />,
      },
      {
        path: Route.GAME,
        element: <Game />,
      },
    ],
  },
]);

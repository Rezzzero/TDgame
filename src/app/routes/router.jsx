import { createBrowserRouter } from "react-router-dom";
import { Route } from "../../shared/constants/constants.js";
import App from "../App.jsx";
import Home from "../../pages/Home/Home.jsx";
import Game from "../../pages/Game/Game.jsx";
import React from "react";

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

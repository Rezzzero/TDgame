import React from "react";
import { useCreateGame } from "../model/useCreateGame";

const CreateGameButton = () => {
  const { createGame } = useCreateGame();
  return (
    <button
      onClick={createGame}
      type="button"
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Создать игру
    </button>
  );
};

export default CreateGameButton;

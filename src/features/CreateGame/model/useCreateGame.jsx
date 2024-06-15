import { useNavigate } from "react-router-dom";

export const useCreateGame = () => {
  const navigate = useNavigate();

  const createGame = () => {
    const username = prompt("Введите ваш никнейм");
    const roomName = prompt("Введите название комнаты");
    if (!username || !roomName) return;

    localStorage.setItem("username", username);
    const gameId = encodeURIComponent(roomName);
    navigate(`/game/${gameId}`);
  };
  return { createGame };
};

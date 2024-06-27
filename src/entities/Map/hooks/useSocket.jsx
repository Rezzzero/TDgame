import { useRef, useEffect, useState } from "react";
import connectSocket from "../../../socket.io.js";

export const useSocket = (gameId) => {
  const socketRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [gameState, setGameState] = useState({
    firstEnemies: [],
    secondEnemies: [],
    firstWizards: [],
    secondWizards: [],
  });
  useEffect(() => {
    const socket = connectSocket();
    socketRef.current = socket;
    const username = localStorage.getItem("username");

    socket.emit("getPlayerType", gameId, (playerType) => {
      localStorage.setItem("playerType", playerType);
      if (username) {
        socket.emit("joinRoom", { gameId, username, playerType });
      }
    });

    socket.on("updateUserList", (userList) => {
      setUsers(userList);
    });

    socket.on("gameState", (gameState) => {
      setGameState(gameState);
    });

    return () => {
      socket.off("updateUserList");
      socket.off("gameState");
      socket.disconnect();
    };
  }, [gameId]);

  return { socketRef, users, gameState };
};

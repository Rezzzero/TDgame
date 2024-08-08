import React, { useEffect } from "react";

export const useGameEvents = (socketRef, setGameState, setGameStart) => {
  useEffect(() => {
    const handleGameStateUpdate = (gameState) => {
      setGameState(gameState);
    };

    const handleGameStarted = () => {
      setGameStart(true);
    };

    const socket = socketRef.current;
    socket.on("gameState", handleGameStateUpdate);
    socket.on("gameStarted", handleGameStarted);

    return () => {
      socket.off("gameState", handleGameStateUpdate);
      socket.off("gameStarted", handleGameStarted);
    };
  }, [socketRef, setGameState, setGameStart]);
};

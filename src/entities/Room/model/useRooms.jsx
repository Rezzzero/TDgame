import { useState, useEffect } from "react";
import { fetchRooms } from "../../../shared/api/api";

export const useRooms = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchRooms()
      .then(setRooms)
      .catch((error) => console.error("Error fetching rooms:", error));
  }, []);

  const reloadRooms = () => {
    fetchRooms()
      .then(setRooms)
      .catch((error) => console.error("Error fetching rooms:", error));
  };

  return { rooms, reloadRooms };
};

import React from "react";

const RoomItem = ({ room, onJoin }) => {
  return (
    <li>
      <button onClick={() => onJoin(room)}>комната: {room}</button>
    </li>
  );
};

export default RoomItem;

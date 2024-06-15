import React from "react";
import RoomItem from "./RoomItem.jsx";

const RoomList = ({ rooms = [], onJoin }) => {
  console.log(rooms);
  return (
    <ul>
      {rooms.map((room) => (
        <RoomItem key={room} room={room} onJoin={onJoin} />
      ))}
    </ul>
  );
};

export default RoomList;

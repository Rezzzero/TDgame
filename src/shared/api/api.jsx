export const fetchRooms = () => {
  return fetch("http://localhost:8080/rooms").then((response) =>
    response.json()
  );
};

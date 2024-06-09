const { io } = require("socket.io-client");
const socket = io("http://localhost:8080", {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd",
  },
});

socket.on("connect", () => {
  console.log("connected");
});

socket.on("disconnect", () => {
  console.log(socket.id); // undefined
});

export default socket;

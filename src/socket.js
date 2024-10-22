import { io } from "socket.io-client";
export const initSocket = async () => {
  const options = {
    "force new connection": true,
    reconnectionAttempt: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
  };
  const backendUrl = "http://localhost:4000";
  return io(backendUrl, options);
};

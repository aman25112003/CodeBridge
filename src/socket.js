import { io } from "socket.io-client";
export const initSocket = async () => {
  const options = {
    "force new connection": true,
    reconnectionAttempt: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
  };
  const backendUrl = "https://code-bridge-plum.vercel.app/";
  return io(backendUrl, options);
};

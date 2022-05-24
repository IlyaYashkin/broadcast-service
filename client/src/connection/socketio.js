import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:53304";

const socketInit = (roomId, user) => {
  return io(SOCKET_URL, {
    auth: {
      token: localStorage.getItem("token"),
    },
    query: {
      roomId: roomId,
      userId: user.id,
      username: user.username,
      email: user.email,
    },
    forceNew: true,
  });
};

export default socketInit;

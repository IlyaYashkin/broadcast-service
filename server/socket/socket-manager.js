const tokenService = require("../services/token-service");
const socketHandler = require("./socket-handler");
const EventEmitter = require("events");

const authList = ["url", "repeat", "skip"];
module.exports = (socket) => {
  const token = socket.handshake.auth.token;
  const roomId = socket.handshake.query.roomId;
  const user = (() => {
    if (!token) {
      return undefined;
    }
    const userData = tokenService.validateAccessToken(token);
    if (!userData) {
      return undefined;
    }
    return {
      username: userData.username,
      id: userData.id,
      isGuest: false,
    };
  })();

  if (!user) {
    socket.info = {
      user: {
        username: socket.handshake.query.username,
        isGuest: true,
      },
      roomId: roomId,
    };
  } else {
    socket.info = {
      user: user,
      roomId: roomId,
    };
  }

  socket.join(roomId);
  socket.use((packet, next) => {
    socket.command = undefined;
    if (packet[1].msg[0] === "!") {
      const commandString = packet[1].msg.substring(1);
      const command = commandString.split(" ");
      // if (command.length === 1) {
      //   socket.command = ["url", command[0]];
      // } else {
      socket.command = command;
      // }
      if (!authList.includes(socket.command[0])) return next();
    } else {
      return next();
    }
    if (user) return next();
    next(new Error("Unauthorized Error"));
  });
  socket.on("message", socketHandler.onMessage);
  socket.on("error", socketHandler.onError);
  socket.on("disconnect", socketHandler.onDisconnect);
};

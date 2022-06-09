const tokenService = require("../services/token-service");
const socketHandler = require("./socket-handler");

// const authList = ["repeat", "skip"];

const authList = ["get-important-data"];

module.exports = (socket) => {
  try {
    // const token = socket.handshake.auth.token;
    const token = socket.handshake.query.token;
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
      try {
        socket.command = undefined;
        console.log(packet);
        if (packet[1].msg[0] === "!") {
          const commandString = packet[1].msg.substring(1);
          const command = [
            commandString.substring(0, commandString.indexOf(" ")),
            commandString.substring(commandString.indexOf(" ") + 1),
          ];
          if (command[0] === "") {
            command.shift();
          }
          socket.command = command;
          if (!authList.includes(socket.command[0])) return next();
        } else {
          return next();
        }
        if (user) return next();
        next(new Error("Unauthorized Error"));
      } catch (e) {}
    });
    socket.on("message", socketHandler.onMessage);
    socket.on("error", socketHandler.onError);
    socket.on("disconnect", socketHandler.onDisconnect);
  } catch (e) {
    console.log(e);
  }
};

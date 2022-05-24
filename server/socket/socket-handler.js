const maps = require("../index");
const broadcastService = require("../services/broadcast-service");

class SocketHandler {
  onMessage(data) {
    const io = this.nsp;
    const socket = this;
    if (!socket.command) {
      io.to(socket.info.roomId).emit("message", {
        user: socket.info.user,
        msg: data.msg,
      });
      return;
    }
    // console.log(`${socket.command[0]}: ${socket.command[1]}`);
    const room = maps.rooms.get(socket.info.roomId);
    switch (socket.command[0]) {
      case "url":
        io.to(socket.info.roomId).emit("server-message", {
          msg: `Пользователь ${socket.info.user.username} добавил запись в очередь`,
        });
        room.playlist.push(socket.command[1]);
        switch (room.state) {
          case "broadcasting":
          case "downloading":
            return;
        }
        broadcastService.download(socket.command[1], socket.info.roomId);
        break;
      case "repeat":
        room.repeat = !room.repeat;
        io.to(socket.info.roomId).emit("server-message", {
          msg: `Пользователь ${socket.info.user.username} ${
            room.repeat ? "включил" : "выключил"
          } повтор текущей записи`,
        });
        break;
      case "skip":
        broadcastService.terminate(socket.info.roomId);
        io.to(socket.info.roomId).emit("server-message", {
          msg: `Пользователь ${socket.info.user.username} пропустил текущую запись`,
        });
        break;
    }
  }

  onError(err) {
    if (err.message === "Unauthorized Error") {
      this.emit("server-message", {
        msg: "Вы не авторизованы",
      });
    }
  }

  onDisconnect(reason) {
    const socket = this;
    const room = socket.adapter.rooms.get(socket.info.roomId);
    if (!room) {
      broadcastService.terminate(socket.info.roomId);
      broadcastService.deleteFile(socket.info.roomId);
      maps.rooms.delete(socket.info.roomId);
    }
    // console.log("Socket disconnected");
  }
}

module.exports = new SocketHandler();

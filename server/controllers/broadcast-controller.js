const ApiError = require("../exceptions/api-error");
const { PassThrough } = require("stream");
const maps = require("../index");

class BroadcastController {
  async play(req, res, next) {
    try {
      const roomId = req.params.room;
      const room = maps.rooms.get(roomId);
      if (!room) {
        return next(ApiError.BadRequest("Комнаты не существует"));
      }
      const responseSink = new PassThrough();
      room.sinks.push(responseSink);
      res.set({
        "Content-Type": "audio/mp3",
      });
      responseSink.pipe(res);
      req.on("close", () => {
        room.sinks.splice(room.sinks.indexOf(responseSink));
      });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new BroadcastController();

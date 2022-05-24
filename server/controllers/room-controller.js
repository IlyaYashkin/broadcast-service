const roomService = require("../services/room-service");

class RoomController {
  async create(req, res, next) {
    try {
      const { name } = req.body;
      const user = {
        username: req.user.username,
        id: req.user.id,
      };
      const room = roomService.create(name, user);
      return res.json(room);
    } catch (e) {
      next(e);
    }
  }

  async getRooms(req, res, next) {
    try {
      const rooms = roomService.getRooms();
      return res.json(rooms);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new RoomController();

const maps = require("../index");
const uuid = require("uuid");
const Room = require("../objects/room");

class RoomService {
  create(name, user) {
    const id = uuid.v4();
    const room = new Room(id, name, user);
    maps.rooms.set(id, room);
    return {
      id: room.id,
      name: room.name,
      owner: room.owner,
    };
  }

  getRooms() {
    const rooms = Array.from(maps.rooms.values());
    return rooms.map((room) => {
      return {
        id: room.id,
        name: room.name,
        owner: room.owner,
      };
    });
  }
}

module.exports = new RoomService();

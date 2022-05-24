import $api from "../connection";

export default class RoomService {
  static async create(name) {
    return $api.post("/rooms/create", { name });
  }

  static async enter(room, user) {
    return $api.post(`/rooms/enter/${room.id}`, { user });
  }

  static async leave(room, user) {
    return $api.post(`/rooms/leave/${room.id}`, { user });
  }

  static async fetchRooms() {
    return $api.get("/rooms");
  }
}

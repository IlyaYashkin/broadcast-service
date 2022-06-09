import $api from "../connection/http";

export default class RoomService {
  static async create(name) {
    return $api.post("/rooms/create", { name });
  }

  static async fetchRooms() {
    return $api.get("/rooms");
  }
}

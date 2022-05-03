import $api from "../http";

export default class PlaylistService {
  static async add(url) {
    return $api.post(`/playlist?action=add&url=${encodeURIComponent(url)}`);
  }

  static async remove(id) {
    return $api.post(`/playlist?action=remove&id=${id}`);
  }

  static async getPlaylist() {
    return $api.get("/playlist");
  }
}

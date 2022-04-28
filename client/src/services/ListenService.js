import $api from "../http";

export default class ListenService {
  static async fetchMedia(url) {
    return $api.get(`/listen?url=${encodeURIComponent(url)}`, {
      responseType: "arraybuffer",
    });
  }
}

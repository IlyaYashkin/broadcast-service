const ApiError = require("../exceptions/api-error");
const playlistService = require("../service/playlist-service");

class PlaylistController {
  async getPlaylist(req, res, next) {
    try {
      const playlist = await playlistService.getPlaylist(req.user.email);
      return res.json(playlist);
    } catch (e) {
      next(e);
    }
  }

  async modifyPlaylist(req, res, next) {
    try {
      switch (req.query.action) {
        case "add":
          await playlistService.add(req.user.email, req.query.url);
          return res.send("media added");
          break;
        case "remove":
          await playlistService.remove(req.user.email, req.query.id);
          return res.send("media removed");
          break;
        default:
          return next(ApiError.BadRequest("Действие не указано"));
      }
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new PlaylistController();

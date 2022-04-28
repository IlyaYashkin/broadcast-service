const ApiError = require("../exceptions/api-error");
const ytdlService = require("../service/ytdl-service");

class YtdlController {
  async download(req, res, next) {
    try {
      if (!req.query.url) {
        return next(ApiError.BadRequest("URL отсутствует"));
      }
      const data = await ytdlService.download(req.query.url);
      res.set({
        "Content-Type": "audio/ogg",
        "Content-Length": data.info.size,
      });

      data.stream.pipe(res);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new YtdlController();

const ApiError = require("../exceptions/api-error");
const ytdlService = require("../service/ytdl-service");
const utf8 = require("utf8");

class YtdlController {
  async listen(req, res, next) {
    try {
      if (!req.query.url) {
        return next(ApiError.BadRequest("URL отсутствует"));
      }
      const data = await ytdlService.download(req.query.url);
      res.set({
        "Access-Control-Expose-Headers": "Media-Title",
        "Content-Type": "audio/ogg",
        "Content-Length": data.fileInfo.size,
        "Media-Title": utf8.encode(data.mediaInfo.title),
      });

      data.stream.pipe(res);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new YtdlController();

const ytdl = require("ytdl-core");
const ytdlp = require("yt-dlp-exec");
const FFmpeg = require("fluent-ffmpeg");
const { PassThrough } = require("stream");
const fs = require("fs");
const path = require("path");
const uuid = require("uuid");
const ApiError = require("../exceptions/api-error");

class YtdlService {
  async download(url) {
    try {
      console.log(url);
      const name = `${uuid.v4()}.opus`;
      const filePath = path.join(process.cwd(), "downloads", name);
      await ytdlp.exec(url, {
        x: true,
        audioFormat: "opus",
        f: "ba",
        o: filePath,
      });
      console.log("Скачалось");

      const stream = fs.createReadStream(filePath);

      stream.on("end", () => {
        fs.unlink(filePath, () => {
          console.log("Файл удален");
        });
      });

      return {
        stream: stream,
        info: fs.statSync(filePath),
      };
    } catch (e) {
      throw ApiError.BadRequest("Неверный URL");
    }
  }

  async getInfo(url) {
    const mediaInfo = await ytdlp(url, { dumpSingleJson: true });
    return mediaInfo;
  }
}

module.exports = new YtdlService();

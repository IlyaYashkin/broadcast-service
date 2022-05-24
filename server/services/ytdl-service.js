const ytdlp = require("yt-dlp-exec");
const fs = require("fs");
const path = require("path");
const uuid = require("uuid");
const ApiError = require("../exceptions/api-error");
const MediaModel = require("../models/media-model");

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
        noPlaylist: true,
      });

      const mediaInfo = await this.handleInfo(url);
      console.log("Скачалось");

      const stream = fs.createReadStream(filePath);

      stream.on("end", () => {
        fs.unlink(filePath, () => {
          console.log("Файл удален");
        });
      });

      return {
        stream: stream,
        fileInfo: fs.statSync(filePath),
        mediaInfo: mediaInfo,
      };
    } catch (e) {
      throw ApiError.BadRequest("Неверный URL");
    }
  }

  async handleInfo(url) {
    try {
      const mediaInfo = await this.getInfo(url);
      const mediaId = mediaInfo.id;
      const source = mediaInfo.extractor;
      let media = await MediaModel.findOne({ mediaId, source });
      if (!media) {
        const title = mediaInfo.title;
        const url = mediaInfo.webpage_url;
        media = await MediaModel.create({
          mediaId,
          source,
          url,
          title,
        });
      }
      const mediaDto = new MediaDto(media);
      return mediaDto;
    } catch (e) {
      throw ApiError.BadRequest("Неверный URL");
    }
  }

  async getInfo(url) {
    const mediaInfo = await ytdlp(url, {
      dumpSingleJson: true,
      noPlaylist: true,
    });
    return mediaInfo;
  }
}

module.exports = new YtdlService();

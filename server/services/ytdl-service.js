const ytdlp = require("yt-dlp-exec");
const ytsr = require("ytsr");

class YtdlService {
  async search(query) {
    try {
      const search = await ytsr(query, { limit: 20 });
      const result = [];
      search.items.forEach((item) => {
        if (item.type === "video" && result.length < 10) {
          result.push({
            title: item.title,
            url: item.url,
          });
        }
      });
      return result;
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new YtdlService();

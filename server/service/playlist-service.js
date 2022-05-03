const ytdlService = require("./ytdl-service");
const playlistModel = require("../models/playlist-model");
const userModel = require("../models/user-model");
const mediaModel = require("../models/media-model");
const ApiError = require("../exceptions/api-error");
const { ObjectId } = require("mongodb");

class PlaylistService {
  async add(email, url) {
    const media = await ytdlService.handleInfo(url);
    const user = await userModel.findOne({ email });
    playlistModel.create({ user: user._id, media: media.id });
  }

  async remove(email, id) {
    const _id = ObjectId(id);
    const media = await mediaModel.findById(_id);
    const user = await userModel.findOne({ email });
    await playlistModel.deleteOne({
      user: user._id,
      media: media._id,
    });
  }

  async getPlaylist(email) {
    const user = await userModel.findOne({ email });
    const playlistData = await playlistModel.find({ user: user._id });
    let playlist = [];
    for (let i = 0; i < playlistData.length; i++) {
      const media = await mediaModel.findById(playlistData[i].media);
      playlist.push(media);
    }
    return playlist;
  }
}

module.exports = new PlaylistService();

const { Schema, model } = require("mongoose");

const PlaylistSchema = new Schema({
  url: { type: String, required: true },
  name: { type: String },
});

module.exports = model("Playlist", PlaylistSchema);

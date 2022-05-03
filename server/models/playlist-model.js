const { Schema, model } = require("mongoose");

const PlaylistSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  media: { type: Schema.Types.ObjectId, ref: "Media" },
});

module.exports = model("Playlist", PlaylistSchema);

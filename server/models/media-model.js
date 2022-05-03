const { Schema, model } = require("mongoose");

const MediaSchema = new Schema({
  mediaId: { type: String, required: true },
  source: { type: String, required: true },
  url: { type: String, required: true },
  title: { type: String },
});

module.exports = model("Media", MediaSchema);

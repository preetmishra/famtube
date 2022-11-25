const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  videoId: { type: String, unique: true, index: true },
  title: String,
  description: String,
  publishedAt: Date,
  thumbnails: Object,
});

module.exports = mongoose.model("Video", videoSchema);

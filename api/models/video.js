const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  videoId: { type: String, unique: true, index: true },
  title: String,
  description: String,
  publishedAt: Date,
  thumbnails: Object,
});

const schema = mongoose.model("Video", videoSchema);
schema.createIndexes({ title: "text", description: "text" });

module.exports = schema;

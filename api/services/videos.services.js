const Video = require("../models/video");

const findAll = async ({ filter = {}, pageNumber = 0, pageLimit = 5 }) => {
  return await Video.find(filter)
    .sort({ publishedAt: -1 })
    .skip(pageNumber * pageLimit)
    .limit(pageLimit);
};

const fetchVideos = async ({ pageNumber, pageLimit }) => {
  return await findAll({ pageNumber, pageLimit });
};

module.exports = {
  fetchVideos,
};

const Video = require("../models/video.models");

const countDocuments = async ({ filter = {} }) => {
  return await Video.find(filter).count();
};

const findAll = async ({ filter = {}, pageNumber = 0, pageLimit = 5 }) => {
  return await Video.find(filter)
    .sort({ publishedAt: -1 })
    .skip(pageNumber * pageLimit)
    .limit(pageLimit);
};

const fetchVideos = async ({ pageNumber, pageLimit, query }) => {
  const filter = {};

  // Use MongoDB's $text index to support full and partial searches.
  if (query) {
    filter["$text"] = { $search: query };
  }

  return {
    data: await findAll({ pageNumber, pageLimit, filter }),
    pagination: {
      total: await countDocuments({ filter }),
      currentPageNumber: pageNumber,
      pageLimit,
    },
  };
};

module.exports = {
  fetchVideos,
};

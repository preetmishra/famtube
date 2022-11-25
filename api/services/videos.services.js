const Video = require("../models/video");

const countDocuments = async ({ filter = {} }) => {
  return await Video.find(filter).count();
};

const findAll = async ({ filter = {}, pageNumber = 0, pageLimit = 5 }) => {
  return await Video.find(filter)
    .sort({ publishedAt: -1 })
    .skip(pageNumber * pageLimit)
    .limit(pageLimit);
};

const fetchVideos = async ({ pageNumber, pageLimit }) => {
  return {
    data: await findAll({ pageNumber, pageLimit }),
    pagination: {
      total: await countDocuments({}),
      currentPageNumber: pageNumber,
      pageLimit,
    },
  };
};

module.exports = {
  fetchVideos,
};

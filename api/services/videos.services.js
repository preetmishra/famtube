const { DatabaseError } = require("../errors");
const Video = require("../models/video.models");

const countDocuments = async ({ filter = {} }) => {
  try {
    return await Video.find(filter).count();
  } catch (err) {
    console.error(err);
    throw new DatabaseError();
  }
};

const findAll = async ({ filter = {}, pageNumber = 0, pageLimit = 5 }) => {
  try {
    return await Video.find(filter)
      .sort({ publishedAt: -1 })
      .skip(pageNumber * pageLimit)
      .limit(pageLimit);
  } catch (err) {
    console.error(err);
    throw new DatabaseError();
  }
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

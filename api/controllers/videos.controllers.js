const videosService = require("../services/videos.services");

const getVideos = async (req, res, next) => {
  try {
    let { pageNumber = 0, pageLimit = 5, query = "" } = req.query;

    pageNumber = parseInt(pageNumber, 10);
    pageLimit = parseInt(pageLimit, 10);

    const videos = await videosService.fetchVideos({
      pageLimit,
      pageNumber,
      query,
    });

    return res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getVideos,
};

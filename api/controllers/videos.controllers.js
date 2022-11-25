const videosService = require("../services/videos.services");

const getVideos = async (req, res) => {
  let { pageNumber = 0, pageLimit = 5 } = req.query;

  pageNumber = parseInt(pageNumber, 10);
  pageLimit = parseInt(pageLimit, 10);

  const videos = await videosService.fetchVideos({ pageLimit, pageNumber });

  return res.status(200).json(videos);
};

module.exports = {
  getVideos,
};

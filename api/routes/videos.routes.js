const express = require("express");
const router = express.Router();

const videosController = require("../controllers/videos.controllers");

router.get("/", videosController.getVideos);

module.exports = router;

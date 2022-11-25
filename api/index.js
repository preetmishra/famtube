const dotenv = require("dotenv");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const videosRouter = require("./routes/videos.routes");

// Set up database.
require("./models/db");

// Load environment variables.
dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("tiny"));

app.use("/videos", videosRouter);

// Handle 404 routes.
app.use(function (req, res) {
  res.status(404).json({
    message: `${req.method} ${req.originalUrl} does not exist`,
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening at ${PORT}`);
});

const dotenv = require("dotenv");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");

const videosRouter = require("./routes/videos.routes");
const { errorHandler } = require("./errors/handler");

// Set up database.
require("./models/db");

// Load environment variables.
dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("tiny"));

// NOTE: Should be more restrictive in production.
app.use(cors());

app.use("/videos", videosRouter);

// Handle 404 routes.
app.use(function (req, res) {
  res.status(404).json({
    message: `${req.method} ${req.originalUrl} does not exist`,
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is listening at ${PORT}`);
});

const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Load environment variables.
dotenv.config();

mongoose.connect(process.env.MONGODB_URI).catch((dbConnectionError) => {
  console.error("Could not connect with MongoDB");
  console.error(dbConnectionError);
});

mongoose.connection.on("connected", () => {
  console.info(`Connected to MongoDB at ${process.env.MONGODB_URI}`);
});

mongoose.connection.on("error", (connectionError) => {
  console.error("MongoDB connection error", connectionError);
});

mongoose.connection.on("disconnected", () => {
  console.info("MongoDB connection disconnected");
});

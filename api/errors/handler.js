function errorHandler(error, request, response, next) {
  console.error(`Error: ${error.message}`);

  const status = error.status || 500;

  response.status(status).send({
    status: status,
    message: error.message || "An unexpected error has occurred",
  });
}

module.exports = { errorHandler };

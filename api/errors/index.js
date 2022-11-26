class DatabaseError extends Error {
  constructor() {
    super();
    this.message = "Something went wrong while querying to the database";
    this.status = 500;
  }
}

module.exports = {
  DatabaseError,
};

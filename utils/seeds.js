"use strict";

var sqlite3 = require("sqlite3").verbose(),
  dbEnv = process.env.DB || "development",
  db = new sqlite3.Database("db/" + dbEnv + ".db");

var movieSeeds = require("../db/movies");
var customerSeeds = require("../db/customers");

// prepare the statement
var movieStatement = db.prepare(
  "INSERT INTO movies(title, overview, inventory, release_date) \
   VALUES (?, ?, ?, ?);"
);

db.serialize(function() {
  // loop them movies
  movieSeeds.forEach(function(movie) {
    // insert each one into the db
    movieStatement.run(
      movie.title,
      movie.overview,
      movie.inventory,
      movie.release_date
    );
  });

  // stop using the prepared statement
  movieStatement.finalize();
});

db.close();

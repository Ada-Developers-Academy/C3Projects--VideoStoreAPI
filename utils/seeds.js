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

var customerStatement = db.prepare(
  "INSERT INTO customers( \
    id, name, registered_at, address, city, state, \
    postal_code, phone, account_credit) \
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);"
);

db.serialize(function() {
  movieSeeds.forEach(function(movie) {
    movieStatement.run(
      movie.title,
      movie.overview,
      movie.inventory,
      movie.release_date
    );
  });

  // stop using the prepared statement
  movieStatement.finalize();

  customerSeeds.forEach(function(customer) {
    customerStatement.run(
      customer.id,
      customer.name,
      customer.registered_at,
      customer.address,
      customer.city,
      customer.state,
      customer.postal_code,
      customer.phone,
      customer.account_credit
    );
  });

  // stop using the prepared statement
  customerStatement.finalize();
});

db.close();

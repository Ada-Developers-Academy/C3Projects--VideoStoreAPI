"use strict";

var sqlite3 = require("sqlite3").verbose(),
  dbEnv = process.env.DB || "development",
  db = new sqlite3.Database("db/" + dbEnv + ".db");

var movieSeeds = require("../db/seeds/movies");
var customerSeeds = require("../db/seeds/customers");
var rentalSeeds = require("../db/seeds/rentals");

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

var rentalStatement = db.prepare(
  "INSERT INTO rentals(id, movie_title, customer_id, returned, check_out_date, return_date) \
   VALUES (?, ?, ?, ?, ?, ?);"
);

// ***************************************************

db.serialize(function() {
  movieSeeds.forEach(function(movie) {
    movieStatement.run(
      movie.title,
      movie.overview,
      movie.inventory,
      Date.parse(movie.release_date)
    );
  });

  // stop using the prepared statement
  movieStatement.finalize();

  // ***********
  customerSeeds.forEach(function(customer) {
    customerStatement.run(
      customer.id,
      customer.name,
      Date.parse(customer.registered_at),
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

  // ***********
  rentalSeeds.forEach(function(rental) {
    rentalStatement.run(
      rental.id,
      rental.movie_title,
      rental.customer_id,
      rental.returned,
      Date.parse(rental.check_out_date),
      Date.parse(rental.return_date)
    );
  });

  // stop using the prepared statement
  rentalStatement.finalize();
});

db.close();

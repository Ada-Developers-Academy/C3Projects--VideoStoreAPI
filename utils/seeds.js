"use strict";

var sqlite3 = require('sqlite3').verbose(),
    db_env = process.env.DB || 'development',
    db = new sqlite3.Database('db/' + db_env + '.db');

var movies = require('./movies');
var movie_statement = db.prepare(
  "INSERT INTO movies(title, overview, release_date, inventory_total, inventory_avail) \
  VALUES (?, ?, ?, ?, ?);"
);

var customers = require('./customers');
var customer_statement = db.prepare(
  "INSERT INTO customers(name, registered_at, address, city, state, postal_code, phone, account_credit) \
  VALUES (?, ?, ?, ?, ?, ?, ?, ?);"
);

var rentals = require('./rentals');
var rental_statement = db.prepare(
  "INSERT INTO rentals(customer_id, name, movie_id, title, checkout_date, due_date, return_date) \
  VALUES (?, ?, ?, ?, ?, ?, ?);"
);

db.serialize(function() {
  // loop through movies
  for(var i = 0; i < movies.length; i++) {
    var movie = movies[i];

    // insert each into the db
    movie_statement.run(
      movie.title,
      movie.overview,
      movie.release_date,
      movie.inventory,
      movie.inventory
    );
  }

  movie_statement.finalize();

  // loop through customers
  for(var i = 0; i < customers.length; i++) {
    var customer = customers[i];

    // insert each into the db
    customer_statement.run(
      customer.name,
      customer.registered_at,
      customer.address,
      customer.city,
      customer.state,
      customer.postal_code,
      customer.phone,
      customer.account_credit
    );
  }

  customer_statement.finalize();

  // loop through rentals
  for(var i = 0; i < rentals.length; i++) {
    var rental = rentals[i];

    // insert each into the db
    rental_statement.run(
      rental.customer_id,
      rental.name,
      rental.movie_id,
      rental.title,
      rental.checkout_date,
      rental.due_date,
      rental.return_date
    );
  }

  rental_statement.finalize();
});

db.close();

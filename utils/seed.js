"use strict";

var sqlite3 = require('sqlite3').verbose(),
    db_env = process.env.DB || 'development',
    db = new sqlite3.Database('db/' + db_env + '.db');

var movies = require('./movies');
//insert into movies(title, inventory) values("Jaws", 10);
var movie_statement = db.prepare(
  "INSERT INTO movies(title, overview, inventory, release_date) \
  VALUES (?, ?, ?, ?);"
);

db.serialize(function() {
  // loop them movies
  for(var i = 0; i < movies.length; i++) {
    var movie = movies[i];

    // insert each one into the db
    movie_statement.run(
      movie.title,
      movie.overview,
      movie.inventory,
      movie.release_date
    );
  }

  movie_statement.finalize();
});

var customers = require('./customers');
var customer_statement = db.prepare(
  "INSERT INTO customers(name, registered_at, address, city, state, postal_code, \
  phone, account_credit) VALUES (?, ?, ?, ?, ?, ?, ?, ?);"
);

db.serialize(function() {
  // loop through customers
  for(var i = 0; i < customers.length; i++) {
    var customer = customers[i];

    // insert each one into the db
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
});

var rentals = require('./rentals');
var rental_statement = db.prepare(
  "INSERT INTO rentals(check_out_date, check_in_date, expected_return_date, \
  customer_id, movie_id) VALUES (?, ?, ?, ?, ?);"
);

db.serialize(function() {
  // loop through rentals
  for(var i = 0; i < rentals.length; i++) {
    var rental = rentals[i];

    // insert each one into the db
    rental_statement.run(
      rental.check_out_date,
      rental.check_in_date,
      rental.expected_return_date,
      rental.customer_id,
      rental.movie_id
    );
  }

  rental_statement.finalize();
});

db.close();

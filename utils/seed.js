"use strict";

var sqlite3 = require('sqlite3').verbose(),
    db_env = process.env.DB || 'development',
    db = new sqlite3.Database('db/' + db_env + '.db');

var movies = require('./movies');
var movie_statement = db.prepare(
  "INSERT INTO movies(title, overview, release_date, total_inventory, inventory_available) \
  VALUES (?, ?, ?, ?, ?);"
);

db.serialize(function() {
  for(var i = 0; i < movies.length; i++) {
    var movie = movies[i];

    movie_statement.run(
      movie.title,
      movie.overview,
      movie.release_date,
      movie.inventory,
      movie.inventory
    );
  }

  movie_statement.finalize();
});

var customers = require('./customers');
var customer_statement = db.prepare(
  "INSERT INTO customers(name, registered_at, address, city, state, postal_zip, phone_number, credit) \
  VALUES (?, ?, ?, ?, ?, ?, ?, ?);"
);

db.serialize(function() {
  for(var i = 0; i < customers.length; i++) {
    var customer = customers[i];

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
  "INSERT INTO rentals(customer_id, movie_id, return_date, checkout_date, due_date) \
  VALUES (?, ?, ?, ?, ?);"
);

db.serialize(function() {
  for(var i = 0; i < rentals.length; i++) {
    var rental = rentals[i];

    rental_statement.run(
      rental.customer_id,
      rental.movie_id,
      rental.return_date,
      rental.checkout_date,
      rental.due_date
    );
  }

  rental_statement.finalize();
});

db.close();

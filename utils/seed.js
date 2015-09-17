"use strict";

var sqlite3 = require('sqlite3').verbose(),
  db_env = process.env.DB || 'development',
  db = new sqlite3.Database('db/' + db_env + '.db');

var movies = require('../movies');
var movie_statement = db.prepare(
  "INSERT INTO movies(title, overview, inventory, release_date) \
  VALUES (?, ?, ?, ?);"
);

db.serialize(function() {
  for(var i = 0; i < movies.length; i++) {
    var movie = movies[i];

    movie_statement.run(
      movie.title,
      movie.overview,
      movie.inventory,
      movie.release_date
    );
  }
  movie_statement.finalize();
});


var customers = require('../customers');
var customer_statement = db.prepare(
  "INSERT INTO customers(name, registered_at, address, city, state, postal_code, phone, account_credit) \
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

// INSERT INTO rentals(customer_id, movie_id, returned_date, checked_out) VALUES (2, 3, 'tomorrow', 1);

// SELECT "movies".* FROM "movies" INNER JOIN "rentals" ON "movies"."id" = "rentals"."movie_id" WHERE "rentals"."movie_id" = 3;

db.close();

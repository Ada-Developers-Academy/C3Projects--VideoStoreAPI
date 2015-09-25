"use strict";

var sqlite3 = require('sqlite3').verbose(),
  db_env = process.env.DB || 'development',
  db = new sqlite3.Database('db/' + db_env + '.db');

var movies = require('../movies');
var movie_statement = db.prepare(
  "INSERT INTO movies(title, overview, release_date, inventory, available) \
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

var rentals = require('../rentals');
var rental_statement = db.prepare(
  "INSERT INTO rentals(movie_id, customer_id, returned_date, checked_out) \
  VALUES (?, ?, ?, ?);"
);

db.serialize(function() {
  for(var i = 0; i < rentals.length; i++) {
    var rental = rentals[i];

    rental_statement.run(
      rental.movie_id,
      rental.customer_id,
      rental.returned_date,
      rental.checked_out
    );
  }
  rental_statement.finalize();
});


// INSERT INTO rentals(customer_id, movie_id, returned_date, checked_out) VALUES (2, 3, 'tomorrow', 1);

// SELECT "movies".* FROM "movies" INNER JOIN "rentals" ON "movies"."id" = "rentals"."movie_id" WHERE "rentals"."movie_id" = 3;

//finds rental based on customer id -> SELECT "rentals".* FROM "rentals" INNER JOIN "customers" ON "customers"."id" = "rentals"."customer_id" WHERE "rentals"."customer_id" = 1;

// returns movies checkout out by customer 1 ->  SELECT "movies".* FROM "movies" INNER JOIN "rentals" ON "movies"."id" = "rentals"."movie_id" WHERE "rentals"."customer_id" = 1 AND "rentals"."returned_date" = "";

//

db.close();

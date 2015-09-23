"use strict";

var sqlite3 = require('sqlite3').verbose(),
    db_env  = process.env.DB || 'development',
    db      = new sqlite3.Database('db/' + db_env + '.db');

var movies = require('../movies');
var movie_statement = db.prepare(
  "INSERT INTO movies(title, overview, inventory, release_date, copies_available) \
  VALUES (?, ?, ?, ?, ?);"
);

var movie_copies_statement = db.prepare(
  "INSERT INTO movie_copies(movie_id) \
  VALUES (?);"
);

var customers = require('../formatted_customers');
var customers_statement = db.prepare(
  "INSERT INTO customers(name, registered_at, address, city, state, postal_code, phone, account_credit) \
  VALUES (?, ?, ?, ?, ?, ?, ?, ?);");

// var convert_register_date = db.prepare(
//   "UPDATE customers SET registered_at = SUBSTR(registered_at, ) WHERE id = ?;");

var rental_statement = db.prepare(
  "INSERT INTO rentals(movie_copy_id, customer_id, checkout_date, return_date, return_status, cost) \
  VALUES (?, ?, ?, ?, ?, ?);"
);

db.serialize(function() {
  // loop them movies
  for (var i = 0; i < movies.length; i++) {
    var movie = movies[i];

    // insert each into db
    movie_statement.run(
      movie.title,
      movie.overview,
      movie.inventory,
      movie.release_date,
      movie.inventory
    );
  }
  movie_statement.finalize();

  // loop them movies FOR COPIES
  for (var i = 0; i < movies.length; i++) {
    var movie = movies[i]; // this needs to be from db, not json seed
    var num_copies = movie.inventory;

    for (var j = 0; j < num_copies; j++) {
      movie_copies_statement.run(
        i+1
      );
    }
  }
  movie_copies_statement.finalize();

  for (var i = 0; i < customers.length; i++) {
    var customer = customers[i];

    // insert each into db
    customers_statement.run(
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

  customers_statement.finalize();

  // for(var i = 0; i < customers.length; i++) {
  //   var customer = customers[i];
  //   var date;
  //   convert_register_date.run(
  //     customer.registered_at,
  //     i + 1
  //   );
  //   date =
  // }

  // convert_register_date.finalize();

  rental_statement.run(
    9, // movie_copy_id
    6,  // customer_id
    "2015-09-18",
    "2015-09-26",
    0, // return_status (0 for false (checked out) 1 for true (returned))
    5 // cost
    );

  rental_statement.run(
    1, // movie_copy_id
    7,  // customer_id
    "2015-09-10",
    "2015-09-13",
    1, // return_status (0 for false (checked out) 1 for true (returned))
    5 // cost
    );

  rental_statement.run(
    9, // movie_copy_id
    7,  // customer_id
    "2015-09-10",
    "2015-09-12",
    1, // return_status (0 for false (checked out) 1 for true (returned))
    5 // cost
    );

  rental_statement.run(
    10,
    1,
    "2015-09-19",
    "2015-09-30",
    0,
    5
    );

  rental_statement.run(
    9,
    6,
    "2015-09-19",
    "2015-09-30",
    1,
    5
    );

  rental_statement.run(
    11,
    6,
    "2015-09-19",
    "2015-09-20",
    0,
    5
    );
  rental_statement.finalize();

});



db.close();

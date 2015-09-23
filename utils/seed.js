"use strict";

// creates db connection
var sqlite3 = require('sqlite3').verbose(),
  db_env = process.env.DB || 'development',
  db = new sqlite3.Database('db/' + db_env + '.db');

// node will parse json files for you if you require them!
var movies = require('./movies');
var movie_statement = db.prepare(
  "INSERT INTO movies(title, overview, release_date, inventory, num_available) \
  VALUES (?, ?, ?, ?, ?);"
);

db.serialize(function() {
  // loop through movies
  for(var i = 0; i < movies.length; i++) {
    var movie = movies[i];
    // insert each one into the db
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
  "INSERT INTO customers(name, registered_at, address, city, state, \
    postal_code, phone, account_credit) VALUES (?, ?, ?, ?, ?, ?, ?, ?);"
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
  "INSERT INTO rentals(checkout_date, return_date, movie_id, customer_id, checked_out) \
  VALUES (?, ?, ?, ?, ?);"
);
// var adjust_num_available_statement = db.prepare(
//   "CASE WHEN rentals.checked_out = 'true' AND rentals.movie_id = 1 THEN UPDATE movies SET num_available = (num_available - 1) WHERE id = 1; "
//
//   "UPDATE movies SET num_available = CASE WHEN (SELECT * FROM movies INNER JOIN rentals ON movies.id = rentals.movie_id WHERE checked_out = 'true' AND movie_id = 1 LIMIT 1) THEN (num_available - 1) ELSE num_available END WHERE id = 1; "

  // SELECT * FROM movies INNER JOIN rentals ON movies.id = rentals.movie_id WHERE checked_out = 'true'

  // UPDATE movies SET num_available = (num_available - 1) WHERE id = 1 AND  (SELECT checked_out FROM rentals WHERE rentals.movie_id = 1 AND rentals.checked_out = 'true');
);

db.serialize(function() {
  // loop through rentals
  for(var i = 0; i < rentals.length; i++) {
    var rental = rentals[i];
    // insert each one into the db
    rental_statement.run(
      rental.checkout_date,
      rental.return_date,
      rental.movie_id,
      rental.customer_id,
      rental.checked_out
    );
    // decrease number of copies available in movies table if checked out.
    // adjust_num_available_statement.run(rental.movie_id);
  }
  rental_statement.finalize();
  // adjust_num_available_statement.finalize();
});

// close db
db.close();


// TRIED TO REDUCE REDUNDENCY BY WRITING A MORE GENERAL FUNCTION
// BUT IT DIDN'T WORK; MAYBE TRY LATER.
// var movie_values = [ title, overview, release_date,
//   inventory ];
//
// function seed(seed_file, statement, values)  {
//   db.serialize(function() {
//   // loop through movies
//   for(var i = 0; i < seed_file.length; i++) {
//     var record = seed_file[i];
//     // insert each one into the db
//     statement.run(
//       for(var i = 0; i < values.length; i++) {
//         record.values[i];
//       }
//     );
//   }
// });
// }
//
// seed(movies, movie_statement, movie_values);

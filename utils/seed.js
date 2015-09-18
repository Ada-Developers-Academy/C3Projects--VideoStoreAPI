"use strict";

var sqlite3 = require('sqlite3').verbose(),
    db_env = process.env.DB || 'development',
    db = new sqlite3.Database('db/' + db_env + '.db');

db.serialize(function seedData() {
  db.parallelize(function() {
    db.serialize(function seedMovies() {
      var statement = db.prepare(
        'INSERT INTO movies (title, overview, release_date, inventory) \
        VALUES (?, ?, ?, ?);'
      );
      var movies = require('./seed_data/movies.json');

      for (var i = 0; i < movies.length; i++) {
        var movie = movies[i];

        statement.run(
          movie.title,
          movie.overview,
          movie.release_date,
          movie.inventory
        );
      }

      statement.finalize();
    });

    db.serialize(function seedCustomers() {
      var statement = db.prepare(
        'INSERT INTO customers (name, registered_at, address, city, state, postal_code, phone, account_balance) \
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);'
      );
      var customers = require('./seed_data/customers.json');

      for (var i = 0; i < customers.length; i++) {
        var customer = customers[i];

        statement.run(
          customer.name,
          customer.registered_at,
          customer.address,
          customer.city,
          customer.state,
          customer.postal_code,
          customer.phone,
          parseInt(customer.account_credit * 100)
        );
      }

      statement.finalize();
    });
  });

  db.serialize(function seedRentals() {
    var statement = db.prepare(
      'INSERT INTO rentals (checkout_date, return_date, movie_title, customer_id) \
      VALUES (?, ?, ?, ?);'
    );

    var rentals = require('./seed_data/rentals.json');

    for (var i = 0; i < rentals.length; i++) {
      var rental = rentals[i];

      statement.run(
        rental.checkout_date,
        rental.return_date,
        rental.movie_title,
        rental.customer_id
      );
    }

    statement.finalize();
  });

  // // THIS HAS PROBLEMS. It tries to execute the callbacks asynchronously, and it has problems because the DB is locked. It only makes ~7 of the 10 rentals before the error.
  // db.serialize(function seedRentals() {
  //   var numRentals = 10;
  //   db.each('SELECT * FROM movies LIMIT ' + numRentals + ';', createRental);
  // });
});

// function createRental(err, movie) {
//   if (err) { console.log('You suck :P'); return; }

//   var db = new sqlite3.Database('db/' + db_env + '.db');

//   db.serialize(function() {
//     var statement = db.prepare(
//       'INSERT INTO rentals (movie_title, customer_id) \
//       VALUES (?, ?);'
//     );

//     statement.run(movie.title, 1);

//     statement.finalize();

//     db.close();
//   });
// }

db.close();
